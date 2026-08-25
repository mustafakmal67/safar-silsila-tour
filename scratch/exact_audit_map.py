import os
import shutil

# Exact 1-to-1 sequential catalog map based on generation batch timestamps and prompt definitions

catalog_mapping = [
    # -------------------------------------------------------------
    # 🌍 1. International Hub & Portals (`international.html`)
    # -------------------------------------------------------------
    ("international_travelers.webp", "SUV_parked_near_Karakoram_Highway_202608242153.jpeg"),
    ("pakistan_visa_help.webp", "Travel_items_on_wooden_desk_202608242153.jpeg"),
    ("city_tours_pakistan.webp", "Badshahi_Mosque_at_sunset_202608242153.jpeg"),
    ("festivals_pakistan.webp", "Hunza_Valley_river_and_mountains_202608242153.jpeg"),
    ("deosai_plains.webp", "Wildflowers_blooming_at_Sheosar_…_202608242153.jpeg"),
    ("foreign_group_trips.webp", "Rakaposhi_viewpoint_over_green_o…_202608250608.jpeg"),

    # -------------------------------------------------------------
    # 🎭 2. Cultural & Mountain Festivals (`festivals.html`)
    # -------------------------------------------------------------
    ("images/festivals/card_1.webp", "Polo_match_at_Shandur_Pass_202608250534.jpeg"),
    ("images/festivals/card_2.webp", "Traditional_Balti_springtime_her…_202608250534.jpeg"),
    ("images/festivals/card_3.webp", "Horses_with_riders_in_valley_202608250534.jpeg"),
    ("images/festivals/card_4.webp", "Bonfire_by_Shyok_River_202608250535.jpeg"),
    ("images/festivals/card_5.webp", "Stream_flowing_through_purple_wi…_202608250535.jpeg"),
    ("images/festivals/card_6.webp", "Yaks_in_terraced_mountain_fields_202608250535.jpeg"),
    ("images/festivals/card_7.webp", "Traditional_wooden_architecture_…_202608250535.jpeg"),
    ("images/festivals/card_8.webp", "Snowy_winter_evening_in_Altit_202608250535.jpeg"),
    ("images/festivals/card_9.webp", "Yaks_traversing_mountain_pass_202608250535.jpeg"),
    ("images/festivals/card_10.webp", "Gurdwara_Janam_Asthan_reflecting…_202608250535.jpeg"),
    ("images/festivals/card_11.webp", "Paragliders_soaring_over_plateau_202608250535.jpeg"),
    ("images/festivals/card_12.webp", "Buddhist_stupa_ruins_at_Taxila_202608250535.jpeg"),
    ("images/festivals/card_13.webp", "Bonfires_illuminating_ancient_fo…_202608250535.jpeg"),
    ("images/festivals/card_14.webp", "Paraglider_soaring_over_hills_202608250535.jpeg"),
    ("images/festivals/card_15.webp", "Parasail_floating_over_Khanpur_Lake_202608250535.jpeg"),
    ("images/festivals/card_16.webp", "Snow-covered_mountain_slopes_of_…_202608250535.jpeg"),
    ("images/festivals/card_17.webp", "Winter_celebration_with_lantern_…_202608250535.jpeg"),
    ("images/festivals/card_18.webp", "Playing_hockey_on_frozen_lake_202608250535.jpeg"),
    ("images/festivals/card_19.webp", "Bicycles_riding_on_highway_besid…_202608250535.jpeg"),

    # -------------------------------------------------------------
    # 🧗 3. Group Trips for Foreigners & Expeditions (`foreign-group-trips.html`)
    # -------------------------------------------------------------
    ("images/foreign/card_1.webp", "Alpine_flowers_blooming_in_meadow_202608250543.jpeg"),
    ("images/foreign/card_2.webp", "Trekking_over_Khot_An_Pass_202608250543.jpeg"),
    ("images/foreign/card_3.webp", "Rupal_Face_Nanga_Parbat_mountain_202608250543.jpeg"),
    ("images/foreign/card_4.webp", "Sheep_grazing_in_alpine_valley_202608250543.jpeg"),
    ("images/foreign/card_5.webp", "Sunlight_illuminating_alpine_tarn_202608250543.jpeg"),
    ("images/foreign/card_6.webp", "Eco-pods_in_pine_forest_202608250543.jpeg"),
    ("images/foreign/card_7.webp", "Alpine_lake_among_granite_peaks_202608250543.jpeg"),
    ("images/foreign/card_8.webp", "Climbing_alpine_ridge_route_202608250543.jpeg"),
    ("images/foreign/card_9.webp", "Hiking_glacier_moraine_trail_202608250544.jpeg"),
    ("images/foreign/card_10.webp", "Mountain_expedition_at_Mazeno_Pass_202608250544.jpeg"),
    ("images/foreign/card_11.webp", "Motorbikes_parked_on_scenic_over…_202608250544.jpeg"),
    ("images/foreign/card_12.webp", "Route_across_Cold_Desert_202608250544.jpeg"),
    ("images/foreign/card_13.webp", "SUVs_crossing_wooden_suspension_…_202608250544.jpeg"),
    ("images/foreign/card_14.webp", "Highway_through_mountain_ranges_202608250544.jpeg"),
    ("images/foreign/card_15.webp", "Airplane_flying_over_snowy_mount…_202608250544.jpeg"),
    ("images/foreign/card_16.webp", "Wooden_boat_sailing_Attabad_Lake_202608250544.jpeg"),
    ("images/foreign/card_17.webp", "Lahore_architecture_and_Hunza_la…_202608250544.jpeg"),
    ("images/foreign/card_18.webp", "Faisal_Mosque_illuminated_in_eve…_202608250544.jpeg"),
    ("images/foreign/card_19.webp", "Walking_track_in_pine_forest_202608250544.jpeg"),
    ("images/foreign/card_20.webp", "Archaeological_excavation_site_i…_202608250544.jpeg"),
    ("images/foreign/card_21.webp", "River_cascading_through_pine_forest_202608250544.jpeg"),
    ("images/foreign/card_22.webp", "River_flowing_through_Yasin_Valley_202608250544.jpeg"),
    ("images/foreign/card_23.webp", "Pakistani_culinary_feast_spread_202608250544.jpeg"),
    ("images/foreign/card_24.webp", "Cooking_meat_at_night_market_202608250544.jpeg"),
    ("images/foreign/card_25.webp", "Off-road_vehicle_driving_desert_…_202608250545.jpeg"),
    ("images/foreign/card_26.webp", "Wild_horses_grazing_in_valley_202608250545.jpeg"),
    ("images/foreign/card_27.webp", "Tandem_paraglider_soaring_above_…_202608250545.jpeg"),
    ("images/foreign/card_28.webp", "Parasail_flyer_above_lake_waters_202608250545.jpeg"),
    ("images/foreign/card_29.webp", "Water_birds_swimming_on_lake_202608250545.jpeg"),
    ("images/foreign/card_30.webp", "Snow_village_in_mountains_202608250545.jpeg"),
    ("images/foreign/card_31.webp", "Expedition_viewing_Siachen_Glaci…_202608250545.jpeg"),
    ("images/foreign/card_32.webp", "Paramotor_pilot_gliding_over_dunes_202608250545.jpeg"),
    ("images/foreign/card_33.webp", "Walnut_trees_in_remote_valley_202608250545.jpeg"),
    ("images/foreign/card_34.webp", "Cyclists_riding_Karakoram_Highway_202608250545.jpeg"),
    ("images/foreign/card_35.webp", "Lahore_Fort_Sheesh_Mahal_archite…_202608250545.jpeg"),
    ("images/foreign/card_36.webp", "Mohatta_Palace_in_Karachi_202608250545.jpeg"),

    # -------------------------------------------------------------
    # 🏙️ 4. City & Heritage Tours (`city-tours.html`)
    # -------------------------------------------------------------
    ("images/city-tours/card_1.webp", "City_skyline_from_Daman-e-Koh_202608250554.jpeg"),
    ("images/city-tours/card_2.webp", "Parasailing_on_Khanpur_Lake_202608250554.jpeg"),
    ("images/city-tours/card_3.webp", "Pipeline_track_in_pine_forest_202608250555.jpeg"),
    ("images/city-tours/card_4.webp", "Sandstone_cliffs_overlooking_gre…_202608250554.jpeg"),
    ("images/city-tours/card_5.webp", "Glamping_huts_and_family_kayaking_202608250555.jpeg"),
    ("images/city-tours/card_6.webp", "Ruins_and_brick_streets_202608250555.jpeg"),
    ("images/city-tours/card_7.webp", "Stone_mausoleums_and_tile_domes_202608250555.jpeg"),
    ("images/city-tours/card_8.webp", "Buddha_carvings_at_Taxila_museum_202608250555.jpeg"),
    ("images/city-tours/card_9.webp", "Chairlift_gliding_over_pine_forest_202608250555.jpeg"),
    ("images/city-tours/card_10.webp", "Pakistan_Monument_architecture_a…_202608250555.jpeg"),
    ("images/city-tours/card_11.webp", "River_flowing_through_Swat_valley_202608250555.jpeg"),
    ("images/city-tours/card_12.webp", "Boudhanath_stupa_with_prayer_flags_202608250555.jpeg"),
    ("images/city-tours/card_13.webp", "Himalayan_sunrise_above_morning_…_202608250555.jpeg"),
    ("images/city-tours/card_14.webp", "Cable_car_rising_to_temple_202608250555.jpeg"),
    ("images/city-tours/card_15.webp", "Pagoda_architecture_by_river_valley_202608250555.jpeg"),
    ("images/city-tours/card_16.webp", "Boats_reflecting_on_lake_202608250555.jpeg"),
    ("images/city-tours/card_17.webp", "Deer_in_mist_at_river_202608250555.jpeg"),
    ("images/city-tours/card_18.webp", "Chunda_Valley_with_terraced_fields_202608250555.jpeg"),
    ("images/city-tours/card_19.webp", "Deodar_forest_with_log_cabins_202608250555.jpeg"),
    ("images/city-tours/card_20.webp", "Wildflowers_blooming_in_meadow_202608250555.jpeg"),
    ("images/city-tours/card_21.webp", "Hopar_Glacier_beneath_peak_summits_202608250556.jpeg"),
    ("images/city-tours/card_22.webp", "Neelum_River_flowing_between_hills_202608250556.jpeg"),
    ("images/city-tours/card_23.webp", "Taobat_village_wooden_houses_river_202608250556.jpeg"),
    ("images/city-tours/card_24.webp", "Toli_Peer_mountain_ridge_views_202608250556.jpeg"),
    ("images/city-tours/card_25.webp", "Ganga_Choti_mountain_peak_overlo…_202608250556.jpeg"),
    ("images/city-tours/card_26.webp", "Tomb_of_Shah_Rukn-e-Alam_202608250556.jpeg"),
    ("images/city-tours/card_27.webp", "Clock_tower_in_bustling_bazaar_202608250556.jpeg"),
    ("images/city-tours/card_28.webp", "Artisans_crafting_leather_sports…_202608250556.jpeg"),
    ("images/city-tours/card_29.webp", "Bala_Hissar_Fort_overlooking_Pes…_202608250557.jpeg"),
    ("images/city-tours/card_30.webp", "Chefs_cooking_barbecue_on_street_202608250557.jpeg"),
    ("images/city-tours/card_31.webp", "Historic_steam_train_passing_forest_202608250557.jpeg"),
    ("images/city-tours/card_32.webp", "Baking_naan_bread_and_tikka_202608250557.jpeg"),
    ("images/city-tours/card_33.webp", "Chef_slicing_Chapli_Kebabs_on_202608250557.jpeg"),
    ("images/city-tours/card_34.webp", "Lamb_roasting_over_burning_embers_202608250557.jpeg"),
    ("images/city-tours/card_35.webp", "Khaddi_Kebab_and_Shinwari_Karahi…_202608250557.jpeg"),
    ("images/city-tours/card_36.webp", "Hanna_Lake_and_mountains_202608250557.jpeg"),
    ("images/city-tours/card_37.webp", "Jaulian_Buddhist_monastery_archa…_202608250557.jpeg"),
    ("images/city-tours/card_38.webp", "Train_crossing_stone_bridges_202608250557.jpeg"),
    ("images/city-tours/card_39.webp", "Archaeological_museum_gardens_wi…_202608250557.jpeg"),
    ("images/city-tours/card_40.webp", "Tirah_mountain_valleys_with_sett…_202608250557.jpeg"),
    ("images/city-tours/card_41.webp", "Paraglider_soaring_above_Islamabad_202608250557.jpeg"),
    ("images/city-tours/card_42.webp", "Parasailing_on_Khanpur_Dam_lake_202608250557.jpeg"),
    ("images/city-tours/card_43.webp", "Water_and_rolling_hills_202608250557.jpeg"),
    ("images/city-tours/card_44.webp", "Sandstone_sphinx_rock_formation_…_202608250557.jpeg"),
    ("images/city-tours/card_45.webp", "Mangla_Dam_Lake_with_houseboats_202608250557.jpeg"),
    ("images/city-tours/card_46.webp", "Indus_River_flowing_through_gorges_202608250557.jpeg"),
    ("images/city-tours/card_47.webp", "Wazir_Khan_Mosque_Lahore_courtyard_202608250557.jpeg"),
    ("images/city-tours/card_48.webp", "Frere_Hall_surrounded_by_lawns_202608250558.jpeg"),
    ("images/city-tours/card_49.webp", "Mahabat_Khan_Mosque_with_frescoes_202608250558.jpeg"),
    ("images/city-tours/card_50.webp", "Dharmarajika_Great_Stupa_in_Taxila_202608250558.jpeg"),
    ("images/city-tours/card_51.webp", "Gurdwara_Panja_Sahib_freshwater_…_202608250558.jpeg"),
    ("images/city-tours/card_52.webp", "Katas_Raj_Temple_reflecting_in_202608250558.jpeg"),

    # -------------------------------------------------------------
    # 🏔️ 5. Northern Pakistan Mountain Escapes (`north-tours.html`)
    # -------------------------------------------------------------
    ("images/north/card_1.webp", "Wildflowers_in_alpine_meadow_202608250607.jpeg"),
    ("images/north/card_2.webp", "Cabin_balcony_overlooking_mounta…_202608250607.jpeg"),
    ("images/north/card_3.webp", "Hikers_crossing_mountain_pass_trail_202608250607.jpeg"),
    ("images/north/card_4.webp", "Glacial_stream_flowing_through_v…_202608250607.jpeg"),
    ("images/north/card_5.webp", "Overland_route_through_Phandar_v…_202608250607.jpeg"),
    ("images/north/card_6.webp", "Red_pagodas_reflecting_in_water_202608250607.jpeg"),
    ("images/north/card_7.webp", "Aerial_view_of_mountain_peaks_202608250607.jpeg"),
    ("images/north/card_8.webp", "Passu_Cones_and_suspension_bridge_202608250607.jpeg"),
    ("images/north/card_9.webp", "Speedboats_crossing_Attabad_Lake_202608250607.jpeg"),
    ("images/north/card_10.webp", "Lahore_mosque_and_mountains_scenery_202608250607.jpeg"),
    ("images/north/card_11.webp", "Sandstone_cliff_overlooking_gree…_202608250608.jpeg"),
    ("images/north/card_12.webp", "Glacier_trekking_path_toward_K2_202608250608.jpeg"),
    ("images/north/card_13.webp", "Karakoram_highway_road_trip_rock…_202608250608.jpeg"),
    ("images/north/card_14.webp", "Valleys_meeting_granite_spires_202608250608.jpeg"),
    ("images/north/card_15.webp", "Boats_on_Mahodand_Lake_202608250608.jpeg"),
    ("images/north/card_16.webp", "Sunrise_over_Himalayan_range_202608250608.jpeg"),
    ("images/north/card_17.webp", "Cable_car_climbing_mountain_202608250608.jpeg"),
    ("images/north/card_18.webp", "Phewa_Lake_mountain_reflection_202608250608.jpeg"),
    ("images/north/card_19.webp", "Wild_deer_grazing_near_river_202608250608.jpeg"),
    ("images/north/card_20.webp", "Chunda_Valley_mountain_orchards_…_202608250608.jpeg"),
    ("images/north/card_21.webp", "Wooden_bridges_crossing_river_202608250608.jpeg"),
    ("images/north/card_22.webp", "Campers_around_campfire_at_sunset_202608250608.jpeg"),
    ("images/north/card_23.webp", "Kumrat_waterfall_plunging_into_pool_202608250608.jpeg"),
    ("images/north/card_24.webp", "Rakaposhi_viewpoint_over_green_o…_202608250608.jpeg"),
    ("images/north/card_25.webp", "Wooden_cable_car_over_river_202608250608.jpeg"),
    ("images/north/card_26.webp", "Lawns_along_river_in_Kashmir_202608250608.jpeg"),
    ("images/north/card_27.webp", "Glacial_lake_surrounded_by_flowers_202608250608.jpeg"),
    ("images/north/card_28.webp", "Wooden_houses_along_river_banks_202608250609.jpeg"),
    ("images/north/card_29.webp", "Alpine_trail_between_Ratti_Gali_202608250609.jpeg"),
    ("images/north/card_30.webp", "Banjosa_Lake_green_waters_and_202608250609.jpeg"),
    ("images/north/card_31.webp", "Sunset_over_mountain_ridge_202608250609.jpeg"),
    ("images/north/card_32.webp", "Lake_Saif-ul-Malook_and_Malika_P…_202608250609.jpeg"),
    ("images/north/card_33.webp", "Sharda_Peeth_ruins_and_river_202608250609.jpeg"),
    ("images/north/card_34.webp", "Horses_grazing_on_mountain_slopes_202608250609.jpeg"),
    ("images/north/card_35.webp", "Rainbow_Lake_reflecting_alpine_w…_202608250609.jpeg"),
    ("images/north/card_36.webp", "River_flowing_past_trees_202608250609.jpeg"),
    ("images/north/card_37.webp", "Ishkoman_valley_with_traditional…_202608250609.jpeg"),
    ("images/north/card_38.webp", "Green_fertile_Yasin_valley_202608250609.jpeg"),
    ("images/north/card_39.webp", "Kites_flying_over_Qaqlasht_plateau_202608250609.jpeg"),
    ("images/north/card_40.webp", "River_winding_through_mountain_v…_202608250609.jpeg"),
    ("images/north/card_41.webp", "Horse_riders_in_green_meadows_202608250609.jpeg"),
    ("images/north/card_42.webp", "Katora_Lake_surrounded_by_cliffs_202608250609.jpeg"),
    ("images/north/card_43.webp", "Mountain_pass_connecting_Dir_Swat_202608250609.jpeg"),
    ("images/north/card_44.webp", "Hiking_trail_toward_Katora_Lake_202608250610.jpeg"),
    ("images/north/card_45.webp", "Terraced_farming_in_green_hills_202608250610.jpeg"),
    ("images/north/card_46.webp", "Parsan_valley_in_Chitral_202608250610.jpeg"),
    ("images/north/card_47.webp", "Bonfire_festival_in_mountain_vil…_202608250610.jpeg"),
    ("images/north/card_48.webp", "Mountain_wilderness_with_meadows…_202608250610.jpeg"),
    ("images/north/card_49.webp", "Bagrot_Valley_traditional_stone_…_202608250610.jpeg"),
    ("images/north/card_50.webp", "Ancient_wooden_Silk_Road_passage_202608250610.jpeg"),
    ("images/north/card_51.webp", "Historic_wooden_mosques_in_valley_202608250610.jpeg"),
    ("images/north/card_52.webp", "Yaks_grazing_in_juniper_forest_202608250610.jpeg"),
    ("images/north/card_53.webp", "Winter_snow_sports_on_mountain_202608250611.jpeg"),
    ("images/north/card_54.webp", "Winter_lantern_lights_in_snow_202608250611.jpeg"),
    ("images/north/card_55.webp", "Siachen_glaciated_landscape_moun…_202608250611.jpeg"),
    ("images/north/card_56.webp", "Wooden_bridge_in_Arandu_village_202608250611.jpeg"),
    ("images/north/card_57.webp", "Jeep_traversing_mountain_road_202608250611.jpeg"),
    ("images/north/card_58.webp", "Shangla_Pass_overlooking_pine_fo…_202608250611.jpeg"),
    ("images/north/card_59.webp", "Swat_river_rushing_through_valley_202608250611.jpeg"),

    # -------------------------------------------------------------
    # 🛂 6. Visa Help (`visa-help.html`)
    # -------------------------------------------------------------
    ("pakistan_visa_help.webp", "Passport_and_map_on_desk_202608250611.jpeg")
]

images_dir_files = set(os.listdir('international images'))

print(f"Total mapping items: {len(catalog_mapping)}")

copied_count = 0
missing_src = []

for target_rel, source_filename in catalog_mapping:
    # Resolve source filename truncated by OS if needed
    matched_src = None
    if source_filename in images_dir_files:
        matched_src = source_filename
    else:
        # Match by prefix (removing trailing unicode ellipsis symbol if any)
        clean_prefix = source_filename.split('…')[0].split('_2026')[0]
        for f in images_dir_files:
            if clean_prefix in f:
                matched_src = f
                break
    
    if matched_src:
        src_path = os.path.join('international images', matched_src)
        dest_path = os.path.join('d:\\websites client\\safar silsila travel agency', target_rel)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        shutil.copy2(src_path, dest_path)
        copied_count += 1
    else:
        missing_src.append((target_rel, source_filename))

print(f"Successfully copied {copied_count} / {len(catalog_mapping)} images!")
if missing_src:
    print("MISSING SOURCES:")
    for t, s in missing_src:
        print(f"  {t} <- {s}")
