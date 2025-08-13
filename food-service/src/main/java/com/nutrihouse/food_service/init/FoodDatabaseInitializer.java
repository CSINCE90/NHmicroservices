package com.nutrihouse.food_service.init;

import com.nutrihouse.food_service.model.Food;
import com.nutrihouse.food_service.repository.FoodRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class FoodDatabaseInitializer implements CommandLineRunner {

    private final FoodRepo foodRepository;

    @Override
    public void run(String... args) {
        if (foodRepository.count() > 0) {
            log.info("Database alimenti già popolato con {} elementi", foodRepository.count());
            return;
        }

        log.info("Inizializzazione database alimenti...");

        try {
            initializeFoods();
            log.info("✅ Database alimenti inizializzato con successo! Inseriti {} alimenti", 
                    foodRepository.count());
        } catch (Exception e) {
            log.error("❌ Errore nell'inizializzazione del database alimenti", e);
        }
    }

    private void initializeFoods() {
        List<Food> foods = List.of(
            // Cereali
            createFood("Pane bianco", 265, 9.0, 49.0, 3.2, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"),
            createFood("Pane integrale", 247, 13.0, 41.0, 4.2, "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"),
            createFood("Pasta di semola", 371, 13.0, 74.0, 1.5, "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400"),
            createFood("Pasta integrale", 348, 13.4, 67.0, 2.9, "https://www.projectbodysmart.com/wp-content/uploads/2020/01/Pasta-integrale.001.jpeg"),
            createFood("Riso bianco", 365, 7.0, 80.0, 0.9, "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400"),
            createFood("Riso integrale", 362, 7.9, 73.0, 2.2, "https://images.unsplash.com/photo-1673158693134-d1bd1043838f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
            createFood("Avena", 389, 16.9, 66.3, 6.9, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"),
            createFood("Quinoa", 368, 14.1, 64.2, 6.1, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"),

            // Carni
            createFood("Pollo petto", 165, 31.0, 0.0, 3.6, "https://img.freepik.com/foto-gratuito/petti-di-pollo-alla-griglia-con-verdure_23-2148189817.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Pollo coscia", 209, 18.4, 0.0, 15.0, "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400"),
            createFood("Tacchino petto", 135, 30.1, 0.0, 1.2, "https://images.unsplash.com/photo-1574781330855-d0db47c96456?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8GFyYzhpm8lMlBjcnVkb3xibmwwtHwwtHx8MA%3D%3D"),
            createFood("Manzo magro", 158, 26.4, 0.0, 5.1, "https://images.unsplash.com/photo-1544025162-d76694265947?w=400"),
            createFood("Maiale lonza", 157, 26.2, 0.0, 5.1, "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400"),
            createFood("Prosciutto crudo", 224, 25.5, 0.0, 12.8, "https://img.freepik.com/foto-gratuito/grissinì-con-prosciutto_2829-16756.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Prosciutto cotto", 215, 19.8, 0.9, 14.7, "https://images.unsplash.com/photo-1580493849943-d5a9c60074cc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JvcONpXRbb3cbmwwtHwwtHx8MA%3D%3D"),

            // Pesce
            createFood("Salmone", 208, 25.4, 0.0, 12.4, "https://img.freepik.com/foto-gratuito/pesce-salmone-crudo-su-ardesia-nera_1220-3158.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Tonno fresco", 159, 21.5, 0.0, 8.1, "https://plus.unsplash.com/premium/photo-1592399564855-153118683aed?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dG9ubm98ZW58MHx8MHx8fDA%3D"),
            createFood("Merluzzo", 82, 17.8, 0.0, 0.7, "https://img.freepik.com/foto-gratuito/bistecca-di-pesce-e-carne-di-barramundi-o-pangasius_74190-5958.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Orata", 121, 20.7, 1.2, 3.8, "https://img.freepik.com/foto-gratuito/dorado-intero-pesce-su-limone-e-rosmarino-fresco_2829-11062.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Branzino", 82, 16.5, 0.6, 1.5, "https://img.freepik.com/free-photo/top-view-fish-ready-be-cooked_23-2150236950.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Sardine", 129, 20.8, 0.0, 4.4, "https://images.unsplash.com/photo-1567087459-8a8e2e7576?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cFyZGtuYXdbnwwtHwwtHx8MA%3D%3D"),
            createFood("Gamberetti", 71, 13.6, 0.6, 0.6, "https://img.freepik.com/foto-gratuito/due-code-di-gamberi-con-limone-fresco-e-rosmarino-sul-bianco_2829-18145.jpg?semt=ais_hybrid&w=740&q=80"),

            // Latticini
            createFood("Latte intero", 64, 3.2, 4.9, 3.6, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"),
            createFood("Latte parzialmente scremato", 46, 3.3, 5.0, 1.5, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"),
            createFood("Yogurt bianco", 61, 3.8, 4.3, 3.9, "https://images.unsplash.com/photo-1571212515416-8d6b0003d75e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MQncxUJdGVuuDBfDBtDBhHww"),
            createFood("Yogurt greco", 97, 9.0, 4.0, 5.0, "https://images.unsplash.com/photo-1564506272681-210484a6e16c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWxuaVlodDhEDBfDBtDBhHww"),
            createFood("Mozzarella", 253, 18.7, 0.7, 19.5, "https://img.freepik.com/premium-photo/mozzarella-cheese-with-basil-white_392895-25331.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Parmigiano", 392, 33.0, 0.0, 28.1, "https://img.freepik.com/foto-gratuito/parmigiano-stagionato-su-un-giatto_53876-144500.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Ricotta vaccina", 146, 8.8, 4.2, 10.9, "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400"),
            createFood("Uova di gallina", 128, 12.4, 0.5, 8.7, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"),

            // Legumi
            createFood("Fagioli borlotti", 133, 10.3, 22.5, 0.8, "https://fedelecolleenze.it/wp-content/uploads/2020/09/Fagioli_borlotti_02_resize.png"),
            createFood("Lenticchie", 291, 22.7, 51.1, 1.0, "https://img.freepik.com/foto-gratuito/lenticchie-verdi-in-una-ciotola-marrone-e-cucchiaio-di-spezie-di-ferro_176474-2106.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Ceci", 316, 20.9, 54.3, 6.3, "https://img.freepik.com/free-photo/chickpea_1368-6565.jpg?semt=ais_hybrid&w=740"),
            createFood("Piselli freschi", 80, 5.5, 11.0, 0.6, "https://img.freepik.com/foto-gratuito/piselli-verdi-in-uno-spaccati_114579-8109.jpg?semt=ais_hybrid&w=740&q=80"),

            // Verdure
            createFood("Pomodori", 17, 1.0, 3.5, 0.2, "https://img.freepik.com/foto-gratuito/vista-dall-alto-di-pomodori-freschi-maturi-con-gocce-d-acqua-su-sfondo-nero_141793-3432.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Zucchine", 11, 1.3, 1.4, 0.1, "https://img.freepik.com/foto-gratuito/zucchine-su-un-tavolo-di-legno_23-2147694386.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Melanzane", 18, 1.1, 2.6, 0.4, "https://img.freepik.com/free-photo/still-life-with-delicious-eggplant_23-2150392269.jpg?semt=ais_hybrid&w=740"),
            createFood("Peperoni", 22, 0.9, 4.2, 0.3, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"),
            createFood("Carote", 35, 1.1, 7.6, 0.2, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"),
            createFood("Spinaci", 31, 3.4, 2.0, 0.7, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"),
            createFood("Broccoli", 27, 3.0, 2.4, 0.4, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400"),
            createFood("Cavolfiore", 25, 3.2, 2.7, 0.2, "https://img.freepik.com/free-photo/front-view-fresh-cauliflower-with-greens-grey-desk_140725-38516.jpg?semt=ais_hybrid&w=740"),
            createFood("Finocchi", 9, 1.2, 1.0, 0.2, "https://img.freepik.com/foto-gratuito/verdura-fresca-di-vista-frontale-su-sfondo-nero_23-2148585783.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Cetrioli", 14, 0.7, 1.8, 0.5, "https://images.unsplash.com/photo-1449300079323-d2e2c1dd8da3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2V0cmliGGZW58MHx8MHx8fDA%3D"),
            createFood("Cipolla", 26, 1.0, 5.7, 0.1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcqOcnmEGQgpv9AEWD5VOKpX77MdNgAhZWFuTzgMLgR&s"),

            // Frutta
            createFood("Mele", 45, 0.3, 11.0, 0.1, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"),
            createFood("Banane", 89, 1.1, 23.0, 0.3, "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400"),
            createFood("Arance", 34, 0.7, 7.8, 0.2, "https://images.unsplash.com/photo-1547514701-42782101795e?w=400"),
            createFood("Kiwi", 44, 1.2, 9.0, 0.6, "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400"),
            createFood("Fragole", 27, 0.9, 5.3, 0.4, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"),
            createFood("Pesche", 28, 0.8, 6.1, 0.1, "https://images.unsplash.com/photo-1692561796964-3c3d486e6422?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8xdGVzY2hlfGVufDB8fDB8fHww"),
            createFood("Pere", 35, 0.3, 8.8, 0.1, "https://img.freepik.com/foto-gratuito/vista-laterale-delle-pere-mature-fresche-su-sfondo-bianco_141793-8128.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Ananas", 42, 0.5, 10.0, 0.1, "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400"),
            createFood("Limoni", 11, 0.6, 2.3, 0.2, "https://at2.depositphotos.com/files/1965240/43706/i/450/depositphotos_437060314-stock-photo-lemons-placed-cut-all-screen.jpg"),

            // Frutta secca
            createFood("Mandorle", 575, 22.0, 4.6, 55.3, "https://img.freepik.com/foto-gratuito/ciotola-con-mandorle-su-sfondo-bianco-vista-dall-alto_1150-37662.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Noci", 582, 14.3, 5.1, 57.7, "https://img.freepik.com/foto-premium/nuci-non-foglie-isolate_163552-326.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Nocciole", 655, 13.8, 5.8, 64.1, "https://img.freepik.com/foto-gratuito/nocciole-miste-in-una-ciotola-e-un-tavolo-di-legno-scuro_176474-2124.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Pistacchi", 562, 18.1, 8.1, 51.6, "https://img.freepik.com/foto-gratuito/struttura-superiore-dei-pistacchi-sbucciata-vista-orizzontale_176474-1409.jpg?semt=ais_hybrid&w=740&q=80"),

            // Oli e condimenti
            createFood("Olio extravergine oliva", 884, 0.0, 0.0, 99.9, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"),
            createFood("Burro", 717, 0.7, 1.1, 83.4, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400"),
            createFood("Aceto balsamico", 88, 0.5, 17.0, 0.0, "https://img.freepik.com/foto-gratuito/giapponese-glaze-il-panno-bianco_23-2148364500.jpg?semt=ais_hybrid&w=740&q=80"),

            // Altri
            createFood("Miele", 330, 0.6, 82.3, 0.0, "https://img.freepik.com/foto-gratuito/miele-e-pane-naturali-sani-in-zolla-sopra-il-panno-bianco_23-2148188902.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Cioccolato fondente 70%", 598, 7.8, 45.9, 42.6, "https://images.unsplash.com/photo-1610450949065-1f2841cc2c6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY2bGF0b3xibmwwtHwwtHx8MA%3D%3D"),
        

            // Frutta
            createFood("Mele", 45, 0.3, 11.0, 0.1, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"),
            createFood("Banane", 89, 1.1, 23.0, 0.3, "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400"),
            createFood("Arance", 34, 0.7, 7.8, 0.2, "https://images.unsplash.com/photo-1547514701-42782101795e?w=400"),
            createFood("Kiwi", 44, 1.2, 9.0, 0.6, "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400"),
            createFood("Fragole", 27, 0.9, 5.3, 0.4, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"),
            createFood("Pesche", 28, 0.8, 6.1, 0.1, "https://images.unsplash.com/photo-1692561796964-3c3d486e6422?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8xdGVzY2hlfGVufDB8fDB8fHww"),
            createFood("Pere", 35, 0.3, 8.8, 0.1, "https://img.freepik.com/foto-gratuito/vista-laterale-delle-pere-mature-fresche-su-sfondo-bianco_141793-8128.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Ananas", 42, 0.5, 10.0, 0.1, "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400"),
            createFood("Limoni", 11, 0.6, 2.3, 0.2, "https://at2.depositphotos.com/files/1965240/43706/i/450/depositphotos_437060314-stock-photo-lemons-placed-cut-all-screen.jpg"),

            // Frutta secca
            createFood("Mandorle", 575, 22.0, 4.6, 55.3, "https://img.freepik.com/foto-gratuito/ciotola-con-mandorle-su-sfondo-bianco-vista-dall-alto_1150-37662.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Noci", 582, 14.3, 5.1, 57.7, "https://img.freepik.com/foto-premium/nuci-non-foglie-isolate_163552-326.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Nocciole", 655, 13.8, 5.8, 64.1, "https://img.freepik.com/foto-gratuito/nocciole-miste-in-una-ciotola-e-un-tavolo-di-legno-scuro_176474-2124.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Pistacchi", 562, 18.1, 8.1, 51.6, "https://img.freepik.com/foto-gratuito/struttura-superiore-dei-pistacchi-sbucciata-vista-orizzontale_176474-1409.jpg?semt=ais_hybrid&w=740&q=80"),

            // Oli e condimenti
            createFood("Olio extravergine oliva", 884, 0.0, 0.0, 99.9, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"),
            createFood("Burro", 717, 0.7, 1.1, 83.4, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400"),
            createFood("Aceto balsamico", 88, 0.5, 17.0, 0.0, "https://img.freepik.com/foto-gratuito/giapponese-glaze-il-panno-bianco_23-2148364500.jpg?semt=ais_hybrid&w=740&q=80"),

            // Altri
            createFood("Miele", 330, 0.6, 82.3, 0.0, "https://img.freepik.com/foto-gratuito/miele-e-pane-naturali-sani-in-zolla-sopra-il-panno-bianco_23-2148188902.jpg?semt=ais_hybrid&w=740&q=80"),
            createFood("Cioccolato fondente 70%", 598, 7.8, 45.9, 42.6, "https://images.unsplash.com/photo-1610450949065-1f2841cc2c6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY2bGF0b3xibmwwtHwwtHx8MA%3D%3D")
        );

        foodRepository.saveAll(foods);
    }

    private Food createFood(String name, double calories, double protein, double carbs, double fat, String photoUrl) {
        Food food = new Food();
        food.setName(name);
        food.setCalories(BigDecimal.valueOf(calories));
        food.setProtein(BigDecimal.valueOf(protein));
        food.setCarbs(BigDecimal.valueOf(carbs));
        food.setFat(BigDecimal.valueOf(fat));
        food.setPhotoUrl(photoUrl);
        return food;
    }
}