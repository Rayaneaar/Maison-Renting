<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $seller1 = User::create([
            'name' => 'Youssef El Fassi',
            'email' => 'youssef@maison.ma',
            'password' => 'password',
            'role' => 'seller',
            'phone' => '+212 600 11 22 33',
        ]);

        $seller2 = User::create([
            'name' => 'Kenza Tazi',
            'email' => 'kenza@maison.ma',
            'password' => 'password',
            'role' => 'seller',
            'phone' => '+212 611 22 33 44',
        ]);

        $client = User::create([
            'name' => 'Amine Berrada',
            'email' => 'amine@maison.ma',
            'password' => 'password',
            'role' => 'client',
            'phone' => '+212 622 33 44 55',
        ]);

        // Seed some reviews for the sellers
        \App\Models\SellerReview::create([
            'user_id' => $seller1->id,
            'reviewer_name' => 'Omar H.',
            'rating' => 5,
            'comment' => 'Very professional and responsive. Highly recommended!',
        ]);
        \App\Models\SellerReview::create([
            'user_id' => $seller1->id,
            'reviewer_name' => 'Nadia B.',
            'rating' => 4,
            'comment' => 'Great properties, smooth transaction.',
        ]);
        \App\Models\SellerReview::create([
            'user_id' => $seller2->id,
            'reviewer_name' => 'Samir C.',
            'rating' => 5,
            'comment' => 'Kenza was wonderful. She found us the perfect Riad.',
        ]);
        \App\Models\SellerReview::create([
            'user_id' => $seller2->id,
            'reviewer_name' => 'Laila M.',
            'rating' => 5,
            'comment' => 'Exceptional service and exquisite property selection.',
        ]);

        // Curated luxury image sets (Unsplash architectural/twilight).
        $imageSets = [
            [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1502005097973-f54253a56736?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1512699256950-f04c515a4ec5?auto=format&fit=crop&w=1600&q=80',
            ],
            [
                'https://images.unsplash.com/photo-1512918580421-b2feaf3cb583?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1501876725168-00c445821c9e?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1522050212171-61b01dd24579?auto=format&fit=crop&w=1600&q=80',
            ]
        ];

        $listings = [
            [
                'title' => 'Riad L’Etoile',
                'city' => 'Marrakech',
                'address' => 'Derb Dabachi, Medina, Marrakech',
                'price' => 12_500_000,
                'type' => 'buy',
                'beds' => 6,
                'baths' => 6,
                'area' => 450,
                'lat' => 31.6295,
                'lng' => -7.9811,
                'desc' => "A beautifully restored traditional riad in the heart of the Medina. Featuring authentic zellige tilework, a central courtyard with a plunge pool, and a rooftop terrace with panoramic views of the Atlas Mountains.",
            ],
            [
                'title' => 'Villa Anfa Supérieur',
                'city' => 'Casablanca',
                'address' => 'Boulevard de l\'Océan, Anfa',
                'price' => 28_000_000,
                'type' => 'buy',
                'beds' => 5,
                'baths' => 6,
                'area' => 850,
                'lat' => 33.5928,
                'lng' => -7.6692,
                'desc' => "An ultra-modern villa situated in Casablanca's most prestigious neighborhood. This property boasts floor-to-ceiling windows, smart home technology, a private cinema, and an infinity pool overlooking the Atlantic Ocean.",
            ],
            [
                'title' => 'Palmeraie Retreat',
                'city' => 'Marrakech',
                'address' => 'Circuit de la Palmeraie, Marrakech',
                'price' => 45_000,
                'type' => 'rent',
                'beds' => 4,
                'baths' => 4,
                'area' => 600,
                'lat' => 31.6548,
                'lng' => -7.9714,
                'desc' => "Escape to this luxurious villa nestled within a sprawling palm grove. Features lush landscaped gardens, a large outdoor swimming pool, and dedicated staff quarters. Perfect for a long-term luxury stay.",
            ],
            [
                'title' => 'Marina Bay Apartment',
                'city' => 'Tangier',
                'address' => 'Avenue Mohammed VI, Marina Bay',
                'price' => 15_000,
                'type' => 'rent',
                'beds' => 2,
                'baths' => 2,
                'area' => 140,
                'lat' => 35.7767,
                'lng' => -5.8039,
                'desc' => "A chic, contemporary apartment offering uninterrupted views of the Mediterranean Sea and the Tangier Marina. High-end finishes throughout and walking distance to exclusive restaurants and boutiques.",
            ],
            [
                'title' => 'Dar Souissi',
                'city' => 'Rabat',
                'address' => 'Avenue Imam Malik, Souissi',
                'price' => 18_500_000,
                'type' => 'buy',
                'beds' => 5,
                'baths' => 5,
                'area' => 700,
                'lat' => 33.9716,
                'lng' => -6.8361,
                'desc' => "Located in the diplomatic quarter, this ambassadorial residence features elegant Moroccan architecture, mature gardens, and expansive reception rooms ideal for entertaining on a grand scale.",
            ],
            [
                'title' => 'Medina Blue House',
                'city' => 'Chefchaouen',
                'address' => 'Rue Outiwi, Chefchaouen',
                'price' => 8_500,
                'type' => 'rent',
                'beds' => 3,
                'baths' => 2,
                'area' => 180,
                'lat' => 35.1714,
                'lng' => -5.2697,
                'desc' => "Experience the magic of the blue city in this charming, traditionally styled home. Tucked away in a quiet alley, it offers authentic design and a terrace with stunning views over the Rif mountains.",
            ],
            [
                'title' => 'The Glass House',
                'city' => 'Casablanca',
                'address' => 'California District, Casablanca',
                'price' => 32_000_000,
                'type' => 'buy',
                'beds' => 6,
                'baths' => 7,
                'area' => 1200,
                'lat' => 33.5412,
                'lng' => -7.6321,
                'desc' => "A true architectural marvel in the exclusive California District. Floor-to-ceiling glass walls seamlessly blend indoor luxury with the immaculate tropical gardens outside.",
            ],
            [
                'title' => 'Riad Al Yacout',
                'city' => 'Fes',
                'address' => 'Batha, Fes el Bali',
                'price' => 12_000,
                'type' => 'rent',
                'beds' => 5,
                'baths' => 5,
                'area' => 380,
                'lat' => 34.0625,
                'lng' => -4.9781,
                'desc' => "Step back in time in this palatial 18th-century Riad. Intricate cedar wood carvings and a vast tiled courtyard transport you to the golden age of Andalusia.",
            ],
            [
                'title' => 'Villa d\'Artiste',
                'city' => 'Tangier',
                'address' => 'Marchan, Tangier',
                'price' => 21_000_000,
                'type' => 'buy',
                'beds' => 4,
                'baths' => 4,
                'area' => 550,
                'lat' => 35.7892,
                'lng' => -5.8214,
                'desc' => "Once home to renowned expatriate writers, this eclectic villa in Marchan offers sweeping views over the Strait of Gibraltar and lush, cascading gardens.",
            ],
            [
                'title' => 'Penthouse Hivernage',
                'city' => 'Marrakech',
                'address' => 'Avenue Echouhada, Hivernage',
                'price' => 15_500_000,
                'type' => 'buy',
                'beds' => 3,
                'baths' => 3,
                'area' => 280,
                'lat' => 31.6219,
                'lng' => -8.0068,
                'desc' => "The pinnacle of urban luxury. This ultra-chic penthouse features a private wrap-around terrace, plunge pool, and unobstructed views of the Koutoubia Mosque.",
            ],
            [
                'title' => 'Oceanfront Estate',
                'city' => 'Agadir',
                'address' => 'Taghazout Bay, Agadir',
                'price' => 35_000,
                'type' => 'rent',
                'beds' => 5,
                'baths' => 6,
                'area' => 900,
                'lat' => 30.5434,
                'lng' => -9.7088,
                'desc' => "Wake up to the sound of crashing waves. This exceptional beachfront estate in Taghazout offers private beach access, a massive infinity pool, and state-of-the-art amenities.",
            ],
            [
                'title' => 'Royal Golf Villa',
                'city' => 'Rabat',
                'address' => 'Dar Es Salam, Rabat',
                'price' => 25_000_000,
                'type' => 'buy',
                'beds' => 6,
                'baths' => 7,
                'area' => 1100,
                'lat' => 33.9213,
                'lng' => -6.8197,
                'desc' => "Situated on the edge of the prestigious Dar Es Salam Royal Golf course. Experience unrivaled privacy, magnificent fairway views, and unparalleled architectural grandeur.",
            ],
        ];

        $sellers = [$seller1, $seller2];

        foreach ($listings as $i => $l) {
            $owner = $sellers[$i % 2];
            $property = Property::create([
                'user_id' => $owner->id,
                'title' => $l['title'],
                'slug' => Str::slug($l['title']),
                'description' => $l['desc'],
                'price' => $l['price'],
                'type' => $l['type'],
                'status' => 'available',
                'bedrooms' => $l['beds'],
                'bathrooms' => $l['baths'],
                'area' => $l['area'],
                'address' => $l['address'],
                'city' => $l['city'],
                'latitude' => $l['lat'],
                'longitude' => $l['lng'],
                'views_count' => random_int(40, 980),
                'available_from' => $l['type'] === 'rent' ? now()->addDays(random_int(1, 15))->format('Y-m-d') : null,
                'available_to' => $l['type'] === 'rent' ? now()->addDays(random_int(30, 180))->format('Y-m-d') : null,
                'video_url' => 'https://player.vimeo.com/video/288344114?h=1211dc826e&color=c9a96a&title=0&byline=0&portrait=0',
            ]);

            $set = $imageSets[$i % count($imageSets)];
            foreach ($set as $j => $url) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'path' => $url,
                    'is_primary' => $j === 0,
                ]);
            }

            // Seed a couple of offers on the first few listings.
            if ($i < 4) {
                Offer::create([
                    'property_id' => $property->id,
                    'client_id' => $client->id,
                    'amount' => $l['price'] * 0.92,
                    'message' => 'Serious buyer — would love to arrange a private viewing this week.',
                    'status' => 'pending',
                ]);
            }
        }
    }
}
