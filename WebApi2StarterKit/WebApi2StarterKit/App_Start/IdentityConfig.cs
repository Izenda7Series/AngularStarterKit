using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using WebApi2StarterKit.Models;
using System.Data.Entity;
using System.Linq;
using System;
using WebApi2StarterKit.Validators;
using System.DirectoryServices.AccountManagement;

namespace WebApi2StarterKit
{
    // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.

    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {
        }

        public async Task<ApplicationUser> FindTenantUserAsync(string tenant, string username)
        {
            var context = ApplicationDbContext.Create();

            var query = context.Users
                .Include(x => x.Tenant)
                .Where(x => x.UserName.Equals(username, StringComparison.InvariantCultureIgnoreCase));

            if (!string.IsNullOrWhiteSpace(tenant))
                query = query.Where(x => x.Tenant.Name.Equals(tenant, StringComparison.InvariantCultureIgnoreCase));
            else
                query = query.Where(x => x.Tenant == null);

            var user = await query.SingleOrDefaultAsync();

            return user;
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new CustomUserValidator<ApplicationUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = false
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }

        public adUser ValidateADUserAsync(string username, string password)
        {
            adUser __ret = new adUser();
            __ret.isValid = false;
            /* Using the domain that the authentication server belongs to. */
            string domainName = Environment.UserDomainName;

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(domainName))
            {
                using (PrincipalContext __ctx = new PrincipalContext(ContextType.Domain, domainName))
                {
                    try
                    {
                        string __adName = GetADUserByEmail(username, __ctx);
                        UserPrincipal userPrincipal = UserPrincipal.FindByIdentity(__ctx, IdentityType.SamAccountName, __adName);
                        
                        if (userPrincipal != null)
                        {
                            __ret.lastName = __adName;
                            __ret.firstName = __adName;
                            __ret.email = username;

                            // Validate credential with Active Directory information. This is optional for authentication process.
                            // If you want check password one more time, you can check here. Otherwise, you need to remove password from parameter and skip this and set isAuthencate as true since userPrincipal is not null.
                            __ret.isValid = __ctx.ValidateCredentials(__adName, password, ContextOptions.Negotiate);
                            if (__ret.isValid) __ret.isValid = !userPrincipal.IsAccountLockedOut();
                            if (__ret.isValid && userPrincipal.Enabled.HasValue && !userPrincipal.Enabled.Value) __ret.isValid = false;
                        }
                    }
                    catch (Exception e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                        __ret.isValid = false;
                    }
                }
            }

            return __ret;
        }
        public async Task<bool>  CreateADUser(adUser usr, string tenant)
        {
            bool __ret = false;
            CreateUserBindingModel model = new CreateUserBindingModel();
            model.FirstName = usr.firstName;
            model.LastName = usr.lastName;
            model.UserID = usr.email;
            model.Tenant = tenant;
            model.IsAdmin = false;
            await CreateUserAsync(model,usr.password);
            return __ret;
        }
        public async Task<string> CreateUserAsync(CreateUserBindingModel model, string pass = "") { 
            string __ret = "";

            //validate tenant name + user name is unique
            if (await FindTenantUserAsync(model.Tenant, model.UserID) != null)
            {
                return string.Format("The User ID '{0}' is already existed in tenant '{1}'.", model.UserID, model.Tenant);
            }

            Tenant tenant = null;

            if (!string.IsNullOrWhiteSpace(model.Tenant))
            {
                tenant = new Tenant { Name = model.Tenant };
                var tenantManager = new Managers.TenantManager();
                var exstingTenant = tenantManager.GetTenantByName(model.Tenant);

                if (exstingTenant != null)
                    tenant = exstingTenant;
                else
                    tenant = await tenantManager.SaveTenantAsync(tenant);
            }
            var user = new ApplicationUser() { UserName = model.UserID, Email = model.UserID, TenantId = tenant?.Id };

            //TODO: do something smarter about the password.
            string __defaultPWD = string.IsNullOrEmpty(pass)?"Izenda@123":pass;
            IdentityResult result = await CreateAsync(user, __defaultPWD);

            if (!result.Succeeded)
            {
                return string.Join(".", result.Errors);
            }
            else
            {
                try
                {
                    user.Tenant = tenant;

                    ////izenda
                    var izendaAdminAuthToken = IzendaBoundary.IzendaTokenAuthorization.GetIzendaAdminToken();

                    if (tenant != null) //TODO: replace this method with the newer one (different parameters)
                        await IzendaBoundary.IzendaUtilities.CreateTenant(tenant.Name, izendaAdminAuthToken);

                    string assignedRole = String.IsNullOrEmpty(model.SelectedRole) ? "Employee" : model.SelectedRole;
                    var success = await IzendaBoundary.IzendaUtilities.CreateIzendaUser(
                        model.Tenant,
                        model.UserID,
                        model.LastName,
                        model.FirstName,
                        model.IsAdmin,
                        assignedRole,
                        izendaAdminAuthToken);

                    /// end izenda
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return __ret;
        }
        public string GetADUserByEmail(string email, PrincipalContext ctx) {
            UserPrincipal qbeUser = new UserPrincipal(ctx);
            qbeUser.EmailAddress = email;

            PrincipalSearcher srch = new PrincipalSearcher(qbeUser);
            Principal __pr = srch.FindOne();
            return __pr.Name;
        }
    }
    public struct adUser
    {
        public bool isValid;
        public string firstName;
        public string lastName;
        public string email;
        public string password;
    }
}
