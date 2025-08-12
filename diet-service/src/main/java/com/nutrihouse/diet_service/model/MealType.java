package com.nutrihouse.diet_service.model;

/**
 * Enum che rappresenta i diversi tipi di pasto in un piano alimentare
 */
public enum MealType {
    
    /**
     * Colazione - Il primo pasto della giornata
     */
    COLAZIONE("Colazione", "08:00", 1),
    
    /**
     * Spuntino mattutino - Snack di metà mattina
     */
    SPUNTINO_MATTINA("Spuntino Mattina", "10:30", 2),
    
    /**
     * Pranzo - Il pasto principale di metà giornata
     */
    PRANZO("Pranzo", "13:00", 3),
    
    /**
     * Merenda - Spuntino pomeridiano
     */
    MERENDA("Merenda", "16:30", 4),
    
    /**
     * Cena - Il pasto serale
     */
    CENA("Cena", "20:00", 5),
    
    /**
     * Spuntino serale - Snack dopo cena (opzionale)
     */
    SPUNTINO_SERA("Spuntino Sera", "22:00", 6);
    
    private final String displayName;
    private final String defaultTime;
    private final int order;
    
    MealType(String displayName, String defaultTime, int order) {
        this.displayName = displayName;
        this.defaultTime = defaultTime;
        this.order = order;
    }
    
    /**
     * @return Il nome visualizzabile del tipo di pasto
     */
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * @return L'orario di default per questo pasto
     */
    public String getDefaultTime() {
        return defaultTime;
    }
    
    /**
     * @return L'ordine di visualizzazione del pasto nella giornata
     */
    public int getOrder() {
        return order;
    }
    
    /**
     * Verifica se questo è un pasto principale
     * @return true se è colazione, pranzo o cena
     */
    public boolean isMainMeal() {
        return this == COLAZIONE || this == PRANZO || this == CENA;
    }
    
    /**
     * Verifica se questo è uno spuntino
     * @return true se è uno spuntino o merenda
     */
    public boolean isSnack() {
        return !isMainMeal();
    }
    
    /**
     * Trova un MealType dal suo display name
     * @param displayName Il nome da cercare
     * @return Il MealType corrispondente o null se non trovato
     */
    public static MealType fromDisplayName(String displayName) {
        for (MealType type : values()) {
            if (type.displayName.equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        return null;
    }
    
    /**
     * Restituisce tutti i pasti principali
     * @return Array con solo i pasti principali
     */
    public static MealType[] getMainMeals() {
        return new MealType[] { COLAZIONE, PRANZO, CENA };
    }
    
    /**
     * Restituisce tutti gli spuntini
     * @return Array con solo gli spuntini
     */
    public static MealType[] getSnacks() {
        return new MealType[] { SPUNTINO_MATTINA, MERENDA, SPUNTINO_SERA };
    }
}