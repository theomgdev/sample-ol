namespace API;

public class Drawing
{
    // Çizimin ID'si
    public int Id { get; set; } = 0;

    // Çizimin adı
    public string Name { get; set; } = string.Empty;

    // Çizimin numarası
    public int Number { get; set; } = 0;

    // Çizimin koordinatları
    public List<Coordinate> Coordinates { get; set; } = new List<Coordinate>();
}