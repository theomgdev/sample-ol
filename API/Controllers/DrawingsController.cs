using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;

namespace API.Controllers;

/*
../Json klasörünün içindeki Drawings.json dosyasındaki verileri çekmek, güncellemek, silmek ve oluşturmak için kullanılan controller.
*/

[ApiController]
[Route("[controller]")]
public class DrawingsController : ControllerBase
{
    private readonly ILogger<DrawingsController> _logger;

    // Constructor
    public DrawingsController(ILogger<DrawingsController> logger)
    {
        _logger = logger;
    }

    // GET: drawings/getall
    [HttpGet("getall")]
    public IActionResult GetAll()
    {
        // Dosyadaki verileri çekmek için oluşturulan değişken
        string jsonData = string.Empty;

        // Dosya yolu
        string filePath = "Json/Drawings.json";

        // Dosya mevcut mu?
        if (System.IO.File.Exists(filePath))
        {
            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }
        else
        {
            // Dosya yoksa oluştur
            System.IO.File.Create(filePath);

            // Dosya içine [] yaz
            System.IO.File.WriteAllText(filePath, "[]");

            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }

        // Okunan veriyi JSON formatından C# nesnesine çevir
        var drawings = JsonConvert.DeserializeObject<List<Drawing>>(jsonData);

        // Çizimlerin listesini döndür
        return Ok(drawings);
    }

    // GET: drawings/getbyid/5
    [HttpGet("getbyid/{id}")]
    public IActionResult GetById(int id)
    {
        // Dosyadaki verileri çekmek için oluşturulan değişken
        string jsonData = string.Empty;

        // Dosya yolu
        string filePath = "Json/Drawings.json";

        // Dosya mevcut mu?
        if (System.IO.File.Exists(filePath))
        {
            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }
        else
        {
            // Dosya yoksa oluştur
            System.IO.File.Create(filePath);

            // Dosya içine [] yaz
            System.IO.File.WriteAllText(filePath, "[]");

            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }

        // Okunan veriyi JSON formatından C# nesnesine çevir
        var drawings = JsonConvert.DeserializeObject<List<Drawing>>(jsonData);

        // Çizimleri filtrele
        var filteredDrawings = drawings.Where(d => d.Id == id).ToList();

        // Filtrelenmiş çizimlerin listesini döndür
        return Ok(filteredDrawings);
    }

    // POST: drawings/create
    [HttpPost("create")]
    public IActionResult Create(Drawing drawing)
    {
        // Dosyadaki verileri çekmek için oluşturulan değişken
        string jsonData = string.Empty;

        // Dosya yolu
        string filePath = "Json/Drawings.json";

        // Dosya mevcut mu?
        if (System.IO.File.Exists(filePath))
        {
            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }
        else
        {
            // Dosya yoksa oluştur
            System.IO.File.Create(filePath);

            // Dosya içine [] yaz
            System.IO.File.WriteAllText(filePath, "[]");

            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }

        // Okunan veriyi JSON formatından C# nesnesine çevir
        var drawings = JsonConvert.DeserializeObject<List<Drawing>>(jsonData);

        // Çizimlerin ID'lerini çek
        var ids = drawings.Select(d => d.Id).ToList();

        var maxId = 0;

        // ID'lerin maksimum değerini çek
        if (ids != null && ids.Any())// Eğer ID'ler boş değilse
        {
            maxId = ids.Max();
        }

        // Çizime ID ata
        drawing.Id = maxId + 1;

        // Çizimleri güncelle
        drawings.Add(drawing);

        // Çizimleri JSON formatına çevir
        jsonData = JsonConvert.SerializeObject(drawings);

        // Çizimleri dosyaya yaz
        System.IO.File.WriteAllText(filePath, jsonData);

        // Çizimi döndür
        return Ok(drawing);
    }

    // PUT: drawings/update
    [HttpPut("update")]
    public IActionResult Update(Drawing drawing)
    {
        // Dosyadaki verileri çekmek için oluşturulan değişken
        string jsonData = string.Empty;

        // Dosya yolu
        string filePath = "Json/Drawings.json";

        // Dosya mevcut mu?
        if (System.IO.File.Exists(filePath))
        {
            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }
        else
        {
            // Dosya yoksa oluştur
            System.IO.File.Create(filePath);

            // Dosya içine [] yaz
            System.IO.File.WriteAllText(filePath, "[]");

            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }

        // Okunan veriyi JSON formatından C# nesnesine çevir
        var drawings = JsonConvert.DeserializeObject<List<Drawing>>(jsonData);

        // Çizimleri güncelle
        drawings = drawings.Select(d => d.Id == drawing.Id ? drawing : d).ToList();

        // Çizimleri JSON formatına çevir
        jsonData = JsonConvert.SerializeObject(drawings);

        // Çizimleri dosyaya yaz
        System.IO.File.WriteAllText(filePath, jsonData);

        // İşlem yapılıp yapılmadığını kontrol et
        var updatedDrawing = drawings.FirstOrDefault(d => d.Id == drawing.Id);
        if (updatedDrawing == null)
        {
            // İşlem başarısız olduysa
            return BadRequest();
        }

        // Çizimi döndür
        return Ok(drawing);
    }

    // DELETE: drawings/delete/5
    [HttpDelete("delete/{id}")]
    public IActionResult Delete(int id)
    {
        // Dosyadaki verileri çekmek için oluşturulan değişken
        string jsonData = string.Empty;

        // Dosya yolu
        string filePath = "Json/Drawings.json";

        // Dosya mevcut mu?
        if (System.IO.File.Exists(filePath))
        {
            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }
        else
        {
            // Dosya yoksa oluştur
            System.IO.File.Create(filePath);

            // Dosya içine [] yaz
            System.IO.File.WriteAllText(filePath, "[]");

            // Dosyayı oku
            jsonData = System.IO.File.ReadAllText(filePath);
        }

        // Okunan veriyi JSON formatından C# nesnesine çevir
        var drawings = JsonConvert.DeserializeObject<List<Drawing>>(jsonData);

        // Çizimleri filtrele
        drawings = drawings.Where(d => d.Id != id).ToList();

        // Çizimleri JSON formatına çevir
        jsonData = JsonConvert.SerializeObject(drawings);

        // Çizimleri dosyaya yaz
        System.IO.File.WriteAllText(filePath, jsonData);

        // OK döndür
        return Ok();
    }
}
