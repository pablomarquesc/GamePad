using System.Text;
using GamePad_TIDAI_2025.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GamePadAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Services.AddControllers();

            builder.Services.AddHttpClient();

            //Conex�o com o banco de dados

            // Configuração de conexão com fallback para variáveis de ambiente
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                ?? Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

            builder.Services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.CommandTimeout(60); // 60 segundos para comandos
                    sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null); // Retry automático
                })
            );

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowFrontend",
                    policy =>
                        policy
                            .WithOrigins(
                                "https://game-pad-ruby.vercel.app",
                                "https://game-cspwg6i4z-pablos-projects-30079fc9.vercel.app",
                                "http://localhost:5173",
                                "https://localhost:5173"
                            )
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials()
                );
            });

            builder
                .Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                "ueiauiueiuajksajksjakjeiuekekjaskjkajsu3eeakjskjaskjskasjksj"
                            )
                        )
                    };
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Executa migrations automaticamente em produção
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                
                try
                {
                    logger.LogInformation("Iniciando aplicação de migrations...");
                    
                    // Aplica as migrations pendentes
                    db.Database.Migrate();
                    
                    logger.LogInformation("Migrations aplicadas com sucesso!");
                }
                catch (Exception ex)
                {
                    // Log do erro para debugging
                    logger.LogError(ex, "Erro ao aplicar migrations: {Message}", ex.Message);
                    throw;
                }
            }

            
            // Habilitar Swagger em desenvolvimento e produção
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "GamePad API v1");
                c.RoutePrefix = "swagger";
            });

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseCors("AllowFrontend");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
