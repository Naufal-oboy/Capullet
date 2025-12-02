-- Tabel untuk website settings
CREATE TABLE IF NOT EXISTS `website_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logo` varchar(255) DEFAULT 'images/logo.png',
  `hero_image` varchar(255) DEFAULT 'images/hero-image.jpg',
  `hero_subtitle` varchar(255) DEFAULT 'Capullet Pangan Lumintu',
  `hero_title` text DEFAULT 'A TASTE TO\nREMEMBER.',
  `hero_button_text` varchar(100) DEFAULT 'Jelajahi Rasa',
  `about_image` varchar(255) DEFAULT 'images/about-home.png',
  `about_tag` varchar(255) DEFAULT 'Sekilas Tentang Kami',
  `about_title` text DEFAULT 'Cita Rasa Otentik,\nDibuat dengan Hati.',
  `about_description` text,
  `stat_products` int(11) DEFAULT 50,
  `stat_customers` int(11) DEFAULT 1000,
  `stat_experience` int(11) DEFAULT 5,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default settings
INSERT INTO `website_settings` (`id`, `about_description`) VALUES
(1, 'Berawal dari kecintaan pada rasa, Capullet menghadirkan berbagai olahan keripik dan frozen food. Kami tidak sekadar menjual makanan, tapi menyajikan pengalaman rasa yang renyah, lezat, dan selalu segar untuk menemani setiap momen spesial Anda.')
ON DUPLICATE KEY UPDATE id=id;
