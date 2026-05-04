using Microsoft.AspNetCore.HttpOverrides;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!))
    };
});
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddDbContext<FinalContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbContext"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", devBuilder =>
    {
        devBuilder.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
    });

    options.AddPolicy("ProdCorsPolicy", prodBuilder =>
    {
        // Trên Production, nên cấu hình các domain frontend cụ thể được phép gọi API
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        if (allowedOrigins.Length > 0)
        {
            prodBuilder.WithOrigins(allowedOrigins)
                       .AllowAnyMethod()
                       .AllowAnyHeader();
        }
        else
        {
            // Tạm thời vẫn mở rộng nếu chưa cấu hình AllowedOrigins trong appsettings.json
            prodBuilder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
        }
    });
});

var app = builder.Build();

// Cấu hình đọc Header từ Nginx/K8s Ingress (X-Forwarded-For, X-Forwarded-Proto)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCorsPolicy");
    // Chỉ ép chuyển HTTPS khi dev ở local (do đã có https localhost). 
    // Môi trường Prod/Container thường dùng Reverse Proxy (Nginx/K8s) nên không chuyển hướng ở đây.
    app.UseHttpsRedirection();
}
else 
{
    app.UseCors("ProdCorsPolicy");
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.Run();