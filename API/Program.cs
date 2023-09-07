var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS politikası tanımla (bütün kaynaklara izin ver)
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});

// CORS politikası tanımla (sadece localhost'a izin ver)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder =>
        {
            builder.WithOrigins("http://localhost")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});

// CORS politikası tanımla (sadece belirli bir web sitesine izin ver)
builder.Services.AddCors(options =>
{
    // clientweb değişkeni ile web sitesinin URL'ini belirle
    var clientweb = "https://google.com"; // varsayılan olarak google.com'a eşit

    options.AddPolicy("AllowWebsite",
        builder =>
        {
            builder.WithOrigins(clientweb)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// CORS politikasını uygula
app.UseCors("AllowAll"); // bütün kaynaklara izin veren politikayı uygula (debug için)

// app.UseCors("AllowLocalhost"); // sadece localhost'a izin veren politikayı uygula (development için)

// app.UseCors("AllowWebsite"); // sadece belirli bir web sitesine izin veren politikayı uygula (production için)

app.UseRouting();

app.MapControllers();

app.Run();