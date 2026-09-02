export const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = IS_LOCAL 
    ? "http://localhost/rjs_animal_haus/api" 
    : "https://animalhaus.com.py/api";

export const IMAGE_BASE_URL = IS_LOCAL 
    ? "http://localhost/rjs_animal_haus/" 
    : "https://animalhaus.com.py/";
