# BaşarSoft OL

Bu proje BaşarSoft için Cahit Karahan'ın katkılarıyla geliştirilmiştir.

Bu proje, harita üzerinde çizim yapma, kaydetme, sorgulama ve gösterme işlevlerini gerçekleştiren basit bir web uygulamasıdır. Uygulama, openlayers, jspanel ve datatables gibi kütüphane ve servisleri kullanmaktadır. Backend için Asp.Net Web Api kullanılmaktadır.

## Kurulum

Bu projeyi çalıştırmak için aşağıdaki adımları izleyin:

1. Bu repoyu klonlayın ya da indirin. Eğer localde çalışacaksanız bilgisayarınızda **.Net 7 SDK** yüklü olmalıdır. Yüklemek için [buraya](https://dotnet.microsoft.com/download/dotnet/7.0) tıklayın.
2. Proje klasörüne girin.
3. `dotnet run` ile localde API sunucunuzu başlatın veya API klasöründe bulunan dosyaları bir IIS sunucusuna kopyalayın.
4. main.js dosyasını açın ve 3. satırda bulunan `baseApiUrl` değişkeninin değerini eğer localde çalışıyorsanız http://localhost:5062/drawings/ olarak aksi taktirde kendi IIS sunucunuzun adresi ile değiştirin. '/' karakteri ile bitmesine dikkat edin.
5. index.html dosyasını bir tarayıcıda açın veya bir web sunucusuna kopyalayın.

## Kullanım

Uygulama, harita üzerinde iki buton içeren bir menü ile başlar. Bu butonlar şunlardır:

- Add Drawing: Bu butona tıklandığında, harita üzerinde istenilen yere polyline çizilebilir. Çizmek için, haritada bir noktaya tıklayın ve sürükleyerek başka bir noktaya gidin. Bu şekilde çizginizi uzatabilirsiniz. Çizginizin şeklini değiştirmek için, haritada başka noktalara tıklayabilirsiniz. Çiziminizi bitirmek için, çift tıklayın ya da son noktaya tekrar tıklayın. Çiziminizi bitirdiğinizde, bir modal-popup açılır. Bu popup'ta sizden isim (string) ve numara (integer) girmeniz istenir. Bu bilgileri girdikten sonra, Kaydet butonuna basın. Böylece, çiziminizin tüm koordinatları ve girdiğiniz isim ve numara bilgileri bir api üzerinden bir txt ya da json dosyasına yazılır. Popup'ta Başarılı mesajı görürseniz, çiziminizin kaydedildiğini anlayabilirsiniz.
- Query Drawing: Bu butona tıklandığında, yine bir modal-popup açılır. Bu popup'ta txt-json dosyası üzerinde tutulan veriler (isim, numara ve koordinatlar) çekilerek bir datatable üzerinde gösterilir. Bu tabloda, kaydettiğiniz çizimlerin bilgilerini görebilirsiniz.

Uygulama açıldığında, daha önceden eklenmiş çizimler harita üzerinde gösterilir.

## API

Projede kullanılan API'nin detaylarına aşağıdan ulaşabilirsiniz:

- http://localhost:5062/drawings/getall: Bu endpoint, txt-json dosyasındaki tüm çizimleri getirir. GET metodu ile çalışır ve herhangi bir parametre almaz.
- http://localhost:5062/drawings/getbyid/{id}: Bu endpoint, txt-json dosyasındaki belirli bir id'ye sahip olan çizimi getirir. GET metodu ile çalışır ve id parametresi alır.
- http://localhost:5062/drawings/create: Bu endpoint, txt-json dosyasına yeni bir çizim ekler. POST metodu ile çalışır ve body olarak Name (string), Number (integer) ve Coordinates (array of objects) alanlarını alır.
- http://localhost:5062/drawings/update: Bu endpoint, txt-json dosyasındaki belirli bir id'ye sahip olan çizimi günceller. PUT metodu ile çalışır ve body olarak Id (integer), Name (string), Number (integer) ve Coordinates (array of objects) alanlarını alır.
- http://localhost:5062/drawings/delete/{id}: Bu endpoint, txt-json dosyasındaki belirli bir id'ye sahip olan çizimi siler. DELETE metodu ile çalışır ve id parametresi alır.

API'nin kullanımına dair bir Postman koleksiyonunu da [burada](https://github.com/theomgdev/sample-ol/blob/master/Tests/Ba%C5%9FarSoft%20OL.postman_collection.json) bulabilirsiniz. Bu rapor, API'nin nasıl çağrılacağına ve hangi sonuçları döndüreceğine dair örnekler içerir.

## Lisans

Bu projenin lisansı BaşarSoft'a aittir. BaşarSoft'un izni olmadan bu projeyi kullanamazsınız.

Bu README.md dosyası, projenizi daha iyi anlamanıza yardımcı olmak için yazılmıştır. Eğer başka bir sorunuz varsa, lütfen bana sorun. 😊
