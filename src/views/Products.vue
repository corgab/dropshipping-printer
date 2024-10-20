<template>
    <div>
        <h1>Il Tuo Negozio</h1>
        <div class="product-list">
            <div v-for="product in products" :key="product.id" class="product-card">
                <h2>{{ product.name }}</h2>
                <img :src="product.thumbnail_url" alt="Immagine del prodotto" />

                <div v-for="variant in product.variants" :key="variant.id" class="variant-card">
                    <p>{{ variant.size }}</p>
                    <p>Prezzo: {{ variant.retail_price }} {{ variant.currency }}</p>
                </div>
            </div>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ProductList',
    data() {
        return {
            products: [],
            error: null,
        };
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                // 1. Richiesta per ottenere l'elenco dei prodotti
                const productsResponse = await axios.get('/api/store/products', {
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_PRINTFUL_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Risposta API prodotti:', productsResponse.data); // Verifica la risposta

                if (productsResponse.data && productsResponse.data.result && productsResponse.data.result.length > 0) {
                    // 2. Mappiamo i prodotti per includere le varianti e l'immagine principale
                    this.products = await Promise.all(productsResponse.data.result.map(async (product) => {
                        // 3. Richiesta per ottenere i dettagli del prodotto
                        const productDetailsResponse = await axios.get(`/api/store/products/${product.id}`, {
                            headers: {
                                'Authorization': `Bearer ${import.meta.env.VITE_PRINTFUL_API_KEY}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        const productDetails = productDetailsResponse.data.result;
                        console.log(productDetails)

                        // 4. Crea un array di varianti per il prodotto
                        const variants = productDetails.sync_variants.map(variant => ({
                            size: variant.size,
                            retail_price: variant.retail_price,
                            currency: variant.currency
                        }));

                        return {
                            id: productDetails.id,
                            name: productDetails.name,
                            thumbnail_url: productDetails.sync_product.thumbnail_url,
                            variants: variants,
                        };
                    }));
                } else {
                    this.error = 'Nessun prodotto trovato.';
                }
            } catch (err) {
                console.error('Errore nella richiesta:', err);
                this.error = err.response ? err.response.data : 'Errore nella richiesta';
            }
        },
    },
};
</script>

<style scoped>
.product-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* Allinea al centro */
}

.product-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    width: 250px;
    /* Aumenta la larghezza per allinearsi meglio */
    text-align: center;
}

.variant-card {
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding-top: 10px;
}

.product-card img {
    max-width: 100%;
    height: auto;
}

.error {
    color: red;
    /* Colore rosso per il messaggio di errore */
    margin-top: 20px;
    text-align: center;
    /* Centra il testo */
}
</style>
