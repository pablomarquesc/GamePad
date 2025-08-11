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

            builder.Services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlOptions =>
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
                            .WithOrigins("https://game-pad-ruby.vercel.app/")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
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

            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

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
