-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-08-2026 a las 22:53:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rjs_animal_haus`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animales`
--

CREATE TABLE `animales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animales`
--

INSERT INTO `animales` (`id`, `nombre`, `estado`) VALUES
(1, 'Aves', 1),
(2, 'Aves Exóticas', 1),
(3, 'Cerdos', 1),
(4, 'Conejos', 1),
(5, 'Gatos', 1),
(6, 'Hámsters', 1),
(7, 'Peces', 1),
(8, 'Perros', 1),
(9, 'Rumiantes', 1),
(10, 'Codornices', 1),
(11, 'Tortugas', 1),
(12, 'Cobayos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `parent_id`, `nombre`, `descripcion`, `slug`, `image_url`, `display_order`, `estado`) VALUES
(1, NULL, 'Sanidad y Nutrición', 'Medicinas, Alimentación sana para los animales.', 'sanidad_nutricion', '', 1, 1),
(2, NULL, 'Equipamiento', 'El equipamiento para la alimentación y bebida de animales varía según su especie.', 'equipamiento', '', 2, 1),
(3, NULL, 'Embalaje', 'Contenedor o envoltura diseñado para proteger, agrupar y facilitar el transporte, almacenamiento y manipulación de mercancías.', '', '', 0, 1),
(4, NULL, 'Prueba', '', '', '', 0, 0),
(5, 2, 'Bebederos', 'Avicultura (granjas), mascotas (perros y gatos) y equipos de refrigeración/hostelería.', '', '', 0, 1),
(6, 2, 'Comederos', 'Según el tipo de animal, el material y el sistema de distribución. Ya sea para mascotas (perros, gatos, aves), producción agropecuaria (bovinos, porcinos, aves de corral)', '', '', 0, 1),
(7, 1, 'Medicamentos', 'Son medicamentos diseñados para tratar o prevenir enfermedades causadas por bacterias en animales.', '', '', 0, 1),
(8, 1, 'Suplementos Minerales', 'Mezclas de elementos inorgánicos (como calcio, fósforo, sodio, zinc y selenio) que se añaden a la dieta de los animales para cubrir carencias nutricionales.', '', '', 0, 1),
(9, 3, 'Maples y Cartones', 'Principalmente para contener, proteger y transportar productos de manera segura, evitando golpes y roturas.', '', '', 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ruc` varchar(20) NOT NULL,
  `direcion` text DEFAULT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `horario_abierto_entre_semana` time NOT NULL,
  `horario_cerrado_entre_semana` time NOT NULL,
  `horario_abierto_fin_semana` time NOT NULL,
  `horario_cerrado_fin_semana` time NOT NULL,
  `logo` text NOT NULL,
  `link_facebook` text DEFAULT NULL,
  `link_instagram` text DEFAULT NULL,
  `link_tiktok` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id`, `nombre`, `ruc`, `direcion`, `telefono`, `email`, `horario_abierto_entre_semana`, `horario_cerrado_entre_semana`, `horario_abierto_fin_semana`, `horario_cerrado_fin_semana`, `logo`, `link_facebook`, `link_instagram`, `link_tiktok`) VALUES
(1, 'Animal Haus', '5631071-4', '1º de Noviembre 134, Capiatá 110207, Paraguay', '+595971957205', 'animalhausparaguay@gmail.com', '08:00:00', '18:00:00', '08:00:00', '13:00:00', 'http://localhost/rjs_animal_haus/uploads/logo_6a6a388bc52ce.png', 'https://www.facebook.com/share/1CCAQQqnZr/', 'https://www.instagram.com/animalhaus.py/', 'https://www.tiktok.com/@animalhaus.py');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `existencias`
--

CREATE TABLE `existencias` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `deposito_id` int(11) NOT NULL,
  `cantidad_actual` int(11) NOT NULL DEFAULT 0,
  `cantidad_minima` int(11) NOT NULL DEFAULT 5,
  `ultima_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `existencias`
--

INSERT INTO `existencias` (`id`, `producto_id`, `deposito_id`, `cantidad_actual`, `cantidad_minima`, `ultima_actualizacion`) VALUES
(1, 2, 1, 5, 5, '2026-08-21 17:08:08'),
(2, 3, 1, 2, 5, '2026-08-21 17:08:08'),
(3, 4, 1, 47, 5, '2026-08-21 17:10:23'),
(4, 5, 1, 1, 5, '2026-08-21 17:10:23'),
(5, 6, 1, 23, 5, '2026-08-21 17:10:44'),
(6, 7, 1, 20, 5, '2026-08-21 17:10:44'),
(7, 8, 1, 13, 5, '2026-08-21 17:11:58'),
(8, 15, 1, 10, 5, '2026-08-21 17:11:58'),
(9, 20, 1, 20, 5, '2026-08-21 17:14:36'),
(10, 21, 1, 20, 5, '2026-08-21 17:14:36'),
(11, 22, 1, 20, 5, '2026-08-21 17:15:06'),
(12, 23, 1, 18, 5, '2026-08-21 17:15:06'),
(13, 24, 1, 13, 5, '2026-08-21 17:16:01'),
(14, 25, 1, 11, 5, '2026-08-21 17:16:01'),
(15, 26, 1, 14, 5, '2026-08-21 17:17:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `impuestos`
--

CREATE TABLE `impuestos` (
  `id` int(20) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `estado` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `impuestos`
--

INSERT INTO `impuestos` (`id`, `descripcion`, `estado`) VALUES
(1, '0', 1),
(2, '5', 1),
(3, '10', 1),
(4, '30', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `direccion_envio` text NOT NULL,
  `telefono_contacto` varchar(50) NOT NULL,
  `subtotal` bigint(20) NOT NULL DEFAULT 0,
  `costo_envio` bigint(20) NOT NULL DEFAULT 0,
  `total` bigint(20) NOT NULL DEFAULT 0,
  `estado` varchar(30) NOT NULL DEFAULT 'pendiente',
  `metodo_pago` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_detalles`
--

CREATE TABLE `pedidos_detalles` (
  `id` bigint(20) NOT NULL,
  `pedido_id` bigint(20) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `sku_producto` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` bigint(20) NOT NULL,
  `subtotal` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `animal_id` int(50) NOT NULL,
  `uni_med_id` int(11) NOT NULL,
  `impuesto_id` int(20) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `detalle` varchar(500) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(500) DEFAULT NULL,
  `image2` varchar(500) DEFAULT NULL,
  `image3` varchar(500) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipo_precio` enum('normal','descuento','oferta') DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `animal_id`, `uni_med_id`, `impuesto_id`, `sku`, `nombre`, `detalle`, `slug`, `precio`, `stock`, `imagen`, `image2`, `image3`, `estado`, `created_at`, `updated_at`, `tipo_precio`) VALUES
(2, 5, 1, 1, 3, 'BEB-BEB-1501', 'Bebedero Automatico Pendular', 'Mantén a tus aves hidratadas con agua siempre fresca y limpia de forma 100% automática. El bebedero automático pendular funciona mediante un sistema de contrapeso (péndulo) que regula el nivel de agua por gravedad: cuando el plato se llena, su propio peso cierra la válvula de paso; al beber las aves, el plato se aligera y la válvula vuelve a abrirse automáticamente.', 'bebedero-automatico-pendular', 65000, 5, 'api/uploads/prod_6a6111d4aea3a.png', NULL, NULL, 1, '2026-07-22 18:35:34', '2026-08-17 20:36:14', 'normal'),
(3, 6, 1, 1, 3, 'COM-COM-6606', 'Comedero (2kg / 25x23cm)', 'Asegura la alimentación continua y eficiente de tus aves con este comedero tipo tolva de 2 kg. Diseñado con las dimensiones perfectas (25 cm de alto x 23 cm de diámetro), es la opción idónea para criaderos pequeños, gallineros caseros o para la etapa de crecimiento de polluelos. Su sistema de caída por gravedad va suministrando el alimento gradualmente a medida que las aves consumen.', 'comedero-2kg-25x23cm-', 16000, 2, 'api/uploads/prod_6a6115d564075.webp', NULL, NULL, 1, '2026-07-22 19:11:17', '2026-08-20 17:43:16', 'normal'),
(4, 7, 9, 1, 3, 'MED-OXI-7610', 'Oxitetraciclina vit 100gr', 'Tratamiento antibiótico de amplio espectro adicionado con un complejo multivitamínico, formulado especialmente para la prevención y control de enfermedades bacterianas en aves, cerdos y otros animales de granja.\r\n\r\nLa combinación de Oxitetraciclina combate eficazmente infecciones respiratorias y digestivas, mientras que el aporte vitamínico acelera la recuperación, estimula el apetito, reduce el estrés (por vacunación, transporte o cambios de clima) y fortalece el sistema inmunitario del animal.', 'oxitetraciclina-vit-100gr', 25000, 47, 'api/uploads/prod_6a6117ed3c3b5.png', NULL, NULL, 1, '2026-07-22 19:20:13', '2026-08-19 18:22:06', 'normal'),
(5, 8, 9, 1, 3, 'SUP-CAL-3858', 'Calcio 5kg', 'Fortalece la estructura ósea de tus animales y optimiza la calidad de la producción con este suplemento de Calcio en presentación de 5 kg. Es un mineral esencial e indispensable en la nutrición avícola y ganadera, además de ser un excelente corrector de suelo para cultivos y huertos.\r\n\r\nEn las aves de postura, garantiza cáscaras de huevo más gruesas y resistentes, previniendo roturas y pérdidas en la recolección.', 'calcio-5kg', 30000, 1, 'api/uploads/prod_6a6118a2c1b12.webp', NULL, NULL, 1, '2026-07-22 19:23:14', '2026-08-17 20:39:43', 'normal'),
(6, 9, 1, 1, 3, 'MAP-CAR-1687', 'Cartones de 30 unid', 'Protege y transporta tus huevos de manera segura con estos cartones/maples biodegradables de alta resistencia. Diseñados con 30 cavidades estándar, son la solución clásica e indispensable para granjas avícolas, avicultores independientes, verdulerías y comercios minoristas.\r\n\r\nSu estructura de pulpa de papel prensado amortigua los impactos, absorbe la humedad sobrante y permite un apilado estable sin riesgo de aplastamiento.', 'cartones-de-30-unid', 10000, 23, 'api/uploads/prod_6a61214c99781.jpg', NULL, NULL, 1, '2026-07-22 19:59:34', '2026-08-17 20:36:47', 'normal'),
(7, 2, 1, 1, 3, 'EQU-TER-7127', 'Termostato STC-3028', 'Toma el control preciso del ambiente de tus proyectos con el STC-3028, un controlador dual digital que mide y regula temperatura y humedad al mismo tiempo. Gracias a sus dos pantallas independientes y sus releds integrados, es la herramienta perfecta para automatizar incubadoras de huevos, terrarios, invernaderos, cámaras de maduración o sistemas de climatización.', 'termostato-stc-3028', 190000, 20, 'api/uploads/prod_6a679a5ced67b.jpg', NULL, NULL, 1, '2026-07-27 17:50:20', '2026-08-17 20:36:55', 'normal'),
(8, 7, 1, 1, 3, 'MED-VAC-9303', 'Vacuna Vaxxon ND-La Sota', 'Protege a tu parvada contra la Enfermedad de Newcastle con Vaxxon ND-La Sota, una vacuna de virus vivo lentogénico (cepa La Sota) de alta eficacia immunogénica. Está formulada para la inmunización activa de aves sanas (pollos de engorde, ponedoras, reproductoras y aves de corral) como primera vacunación o como refuerzo periódico.', 'vacuna-vaxxon-nd-la-sota', 48000, 13, 'api/uploads/prod_6a679d3fe8d19.webp', NULL, NULL, 1, '2026-07-27 18:02:39', '2026-08-17 20:38:25', 'normal'),
(15, 6, 1, 1, 3, 'COM-COM-7045', 'Comedero Plastico para Aves (30cm)', '¡Garantiza la alimentación adecuada y limpia para tus aves! Este comedero de plástico de 30 cm está diseñado pensando en la comodidad de tus animales y en la practicidad de tu día a día. Es la solución perfecta para pollos, gallinas, palomas, codornices y otras aves de corral o voladero.', 'comedero-plastico-para-aves-30cm-', 22000, 10, 'api/uploads/prod_6a67a2b056d55.jpg', NULL, NULL, 1, '2026-07-27 18:10:44', '2026-08-20 18:32:01', 'normal'),
(20, 5, 2, 1, 3, 'BEB-BEB-3524', 'Bebedero de Colibri (200ml 20x13cm)', '¡Llena tu jardín de vida, color y alegría! Este bebedero de 200 ml está especialmente diseñado para atraer colibríes (picaflores) y otras aves pequeñas. Con unas dimensiones prácticas de 20 cm de alto por 13 cm de ancho, es el tamaño ideal para mantener el néctar siempre fresco, evitando que se fermente por permanecer demasiado tiempo al sol.\r\n\r\nSu vistoso diseño en tonos brillantes actúa como un imán visual para las aves, mientras que su estructura facilita la limpieza rápida y el rellenado dia', 'bebedero-de-colibri-200ml-20x13cm-', 20000, 20, 'api/uploads/prod_6a7dfce8c12e5.png', NULL, NULL, 1, '2026-08-13 17:20:40', '2026-08-17 20:37:03', 'normal'),
(21, 2, 6, 1, 3, 'EQU-CAM-6680', 'Cama para Hamster (15x8 cm)', '¡Dale a tu pequeña mascota el descanso suave y cálido que se merece! Esta camita/nido de 15x8 cm está diseñada especialmente para adaptarse al cuerpo de roedores pequeños, brindándoles un refugio acogedor, seguro y protegido del frío donde descansar o tomar sus siestas.\r\n\r\nSus dimensiones son perfectas para no ocupar espacio excesivo dentro de la jaula, ofreciendo al mismo tiempo la profundidad justa para que tu hámster se sienta protegido como si estuviera en su madriguera natural.', 'cama-para-hamster-15x8-cm-', 25000, 20, 'api/uploads/prod_6a7e02298e093.jpg', NULL, NULL, 1, '2026-08-13 17:43:05', '2026-08-17 20:37:06', 'normal'),
(22, 7, 3, 1, 3, 'MED-DIC-2740', 'Diclovet 50ml Diclofenac Sodico', 'Diclovet 50 ml es un potente antiinflamatorio no esteroideo (AINE) a base de Diclofenaco Sódico, formulado para el tratamiento rápido y efectivo del dolor, la inflamación y la fiebre en animales de granja y de trabajo.\r\n\r\nActúa bloqueando la síntesis de prostaglandinas, lo que brinda un alivio inmediato en procesos musculoesqueléticos agudos y crónicos, además de actuar como coadyuvante en cuadros infecciosos respiratorios o mamarios para acelerar la recuperación del animal.', 'diclovet-50ml-diclofenac-sodico', 37000, 20, 'api/uploads/prod_6a7e0349982a5.jpg', NULL, NULL, 1, '2026-08-13 17:47:53', '2026-08-17 20:38:31', 'normal'),
(23, 8, 6, 1, 3, 'SUP-ALI-7860', 'Alimento Extruido Mega Zoo para Hamster y Jerbos', 'Brinda a tu pequeña mascota una nutrición de nivel profesional con el Alimento Extruido Megazoo. Formulado específicamente para cubrir las exigencias metabólicas de hámsters y jerbos, este alimento en pellets súper premium garantiza que tu mascota reciba todos los nutrientes, vitaminas y minerales necesarios en cada bocado.\r\n\r\nAl ser un alimento 100% extruido, elimina por completo la conducta de selección (cuando la mascota come solo lo que le gusta y deja lo saludable), previniendo deficiencias', 'alimento-extruido-mega-zoo-para-hamster-y-jerbos', 35000, 18, 'api/uploads/prod_6a7e04b51f3bd.webp', NULL, NULL, 1, '2026-08-13 17:53:38', '2026-08-18 19:58:47', 'normal'),
(24, 9, 1, 1, 3, 'MAP-CAR-7088', 'Cartones de 6 unidades (Fardos de 100)', 'Optimiza la venta minorista y destaca la presentación de tus huevos con estos estuches de cartón prensado con capacidad para 6 unidades. Presentados en un práctico fardo de 100 unidades, son la opción ideal para granjas, productores de huevos orgánicos/de pastoreo, minimarkets y ventas al por menor.\r\n\r\nSu diseño tipo estuche con tapa de cierre seguro no solo protege el producto contra impactos durante el traslado, sino que ofrece una presentación impecable, ecológica y lista para el consumidor f', 'cartones-de-6-unidades-fardos-de-100-', 90000, 13, 'api/uploads/prod_6a7e06674825f.jpg', NULL, NULL, 1, '2026-08-13 18:01:11', '2026-08-20 20:22:44', 'normal'),
(25, 8, 2, 1, 2, 'SUP-ALP-1005', 'Alpiste 500gr', 'Ofrece a tus aves una alimentación pura, sana y nutritiva con este Alpiste Seleccionado de 500 g. Esta semilla es la base fundamental en la dieta de canarios, periquitos, diamantes, finches y otros pájaros cantores o de jaula, aportándoles la energía diaria que necesitan para mantenerse vitales y activos.\r\n\r\nSometido a un proceso de limpieza para eliminar polvo e impurezas, este alpiste garantiza una semilla fresca, limpia y de excelente sabor que favorece la digestión y el brillo del plumaje.', 'alpiste-500gr', 15000, 11, 'api/uploads/prod_6a7e0781bd9d2.png', NULL, NULL, 1, '2026-08-13 18:04:45', '2026-08-19 18:22:06', 'normal'),
(26, 8, 11, 1, 3, 'SUP-LAB-4478', 'Labcon Morrocoy 300gr', 'Asegura la salud, vitalidad y el correcto desarrollo del caparazón de tu mascota con Labcon Club Tortugas Terrestres (300 g). Este alimento extruido en bastoncillos/pellets está formulado específicamente para cubrir los requerimientos nutricionales de las tortugas de hábitos terrestres (como el morrocoy, tortuga de patas rojas/amarillas y otras especies vegetarianas u omnívoras).\r\n\r\nSustituye de forma equilibrada la oferta de vegetales, aportando la relación correcta de calcio, fósforo y fibra e', 'labcon-morrocoy-300gr', 88000, 14, 'api/uploads/prod_6a7e0893918ba.webp', NULL, NULL, 1, '2026-08-13 18:10:27', '2026-08-17 20:38:50', 'normal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `talonarios`
--

CREATE TABLE `talonarios` (
  `id` int(20) NOT NULL,
  `timbrado_id` int(20) NOT NULL,
  `tipo_comprobante` varchar(30) NOT NULL,
  `establecimiento` varchar(3) NOT NULL,
  `punto_expedicion` varchar(3) NOT NULL,
  `numero_inicial` int(20) NOT NULL,
  `numero_final` int(20) NOT NULL,
  `numero_actual` int(20) NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `talonarios`
--

INSERT INTO `talonarios` (`id`, `timbrado_id`, `tipo_comprobante`, `establecimiento`, `punto_expedicion`, `numero_inicial`, `numero_final`, `numero_actual`, `estado`) VALUES
(1, 1, 'Factura', '001', '001', 1, 9999999, 4, 1),
(2, 1, 'Ticket', '001', '001', 1, 9999999, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `timbrados`
--

CREATE TABLE `timbrados` (
  `id` int(20) NOT NULL,
  `nro_timbrado` int(15) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `timbrados`
--

INSERT INTO `timbrados` (`id`, `nro_timbrado`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(1, 18641596, '2026-02-10', '2030-02-01', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_medidas`
--

CREATE TABLE `unidades_medidas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `simbolo` varchar(10) NOT NULL,
  `permitir_decimal` varchar(1) NOT NULL DEFAULT 'N',
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidades_medidas`
--

INSERT INTO `unidades_medidas` (`id`, `nombre`, `simbolo`, `permitir_decimal`, `estado`) VALUES
(1, 'Unidades', 'Ud', 'N', 1),
(2, 'Kilogramos', 'kg', 'S', 1),
(3, 'Litros', 'L', 'S', 1),
(4, 'Metros', 'm', 'S', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL COMMENT 'Identificador público para APIs y frontend',
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL COMMENT 'Compatible con bcrypt, Argon2 o PBKDF2',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `documento` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL COMMENT 'Formato internacional E.164 (ej. +595981234567)',
  `avatar_url` varchar(500) DEFAULT NULL,
  `rol` varchar(30) NOT NULL DEFAULT 'customer' COMMENT 'Valores: customer, admin, support',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `uuid`, `email`, `password_hash`, `email_verified_at`, `remember_token`, `nombre`, `apellido`, `documento`, `telefono`, `avatar_url`, `rol`, `is_active`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '191c0229-3a90-4aac-9fc4-3854f5f3f895', 'eliasdruiz13@gmail.com', '$2y$10$WFvaJ/YDX3KnbpyBthiAN.vMdCF5r5.OcxnoBbwoyHAUYgEc0h1dm', NULL, NULL, 'Elias', 'Ruiz', NULL, '0991791219', NULL, '1', 1, '2026-08-22 00:01:15', '2026-07-15 19:02:35', '2026-08-21 19:01:15', NULL),
(2, 'f35f1478-9538-45bf-b9cf-5412eac4e34d', 'eliasruiz548@gmail.com', '$2y$10$uNBPLez5eHTUdPG7qCs4SulP/LZ.77iDnzUK0/IuA7KHqMrsJaa.2', NULL, NULL, 'Daniel', 'Ruiz', '5499711', '0991791219', NULL, '2', 1, '2026-08-21 00:18:37', '2026-08-08 01:19:44', '2026-08-20 19:18:37', NULL),
(3, '0fb24df4-385b-42c4-aad2-a6b18905640a', 'richar@gmail.com.py', '$2y$10$/F5m9kxyQl7dxoJtdrHU7.lZ0c9RWGFyfq0RJkNQNSsItqnQ20Fum', NULL, NULL, 'Richar', 'Lopez', NULL, '0991791219', NULL, '2', 1, '2026-08-18 23:14:11', '2026-08-18 18:04:27', '2026-08-18 18:14:11', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `cliente_id` int(50) NOT NULL,
  `talonario_id` int(20) NOT NULL,
  `nro_factura` varchar(50) DEFAULT NULL,
  `condicion_venta` int(1) NOT NULL DEFAULT 1,
  `fecha` datetime NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'confirmado',
  `metodo_cobro` varchar(30) NOT NULL,
  `direccion_envio` text DEFAULT NULL,
  `costo_envio` int(11) DEFAULT NULL,
  `total_exenta` decimal(10,2) DEFAULT NULL,
  `gravada_5` decimal(10,2) DEFAULT NULL,
  `gravada_10` decimal(10,2) DEFAULT NULL,
  `gravada_30` decimal(10,2) DEFAULT NULL,
  `total_iva_5` decimal(10,2) DEFAULT NULL,
  `total_iva_10` decimal(10,2) DEFAULT NULL,
  `total_iva_30` decimal(10,2) DEFAULT NULL,
  `liquidacion_iva` decimal(10,2) NOT NULL,
  `total` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `cliente_id`, `talonario_id`, `nro_factura`, `condicion_venta`, `fecha`, `estado`, `metodo_cobro`, `direccion_envio`, `costo_envio`, `total_exenta`, `gravada_5`, `gravada_10`, `gravada_30`, `total_iva_5`, `total_iva_10`, `total_iva_30`, `liquidacion_iva`, `total`) VALUES
(1, 2, 2, '001-001-0000001', 1, '2026-08-20 14:43:16', 'confirmado', 'efectivo', 'Capiatá - 20.000 Gs.', 20000, 0.00, 0.00, 36000.00, 0.00, 0.00, 3272.73, 0.00, 3272.73, 36000),
(2, 2, 2, '001-001-0000002', 1, '2026-08-20 14:55:58', 'anulado', 'transferencia', '', 0, 0.00, 0.00, 22000.00, 0.00, 0.00, 2000.00, 0.00, 2000.00, 22000),
(3, 3, 1, '001-001-0000001', 1, '2026-08-20 17:19:24', 'pendiente_pago', 'pagopar', 'Asuncion', 25000, 0.00, 0.00, 115000.00, 0.00, 0.00, 10454.55, 0.00, 10454.55, 115000),
(4, 2, 1, '001-001-0000002', 1, '2026-08-20 17:20:37', 'pendiente_pago', 'pagopar', 'Asunción', 25000, 0.00, 0.00, 115000.00, 0.00, 0.00, 10454.55, 0.00, 10454.55, 115000),
(5, 2, 1, '001-001-0000003', 1, '2026-08-20 17:22:44', 'pendiente_pago', 'pagopar', 'Asunción', 25000, 0.00, 0.00, 115000.00, 0.00, 0.00, 10454.55, 0.00, 10454.55, 115000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_detalles`
--

CREATE TABLE `ventas_detalles` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(20) NOT NULL,
  `precio_unitario` int(20) NOT NULL,
  `porcentaje_impuesto` int(2) NOT NULL,
  `monto_impuesto` decimal(10,2) NOT NULL,
  `subtotal` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_detalles`
--

INSERT INTO `ventas_detalles` (`id`, `venta_id`, `producto_id`, `cantidad`, `precio_unitario`, `porcentaje_impuesto`, `monto_impuesto`, `subtotal`) VALUES
(1, 1, 3, 1, 16000, 10, 1454.55, 16000),
(2, 2, 15, 1, 22000, 10, 2000.00, 22000),
(3, 3, 1, 1, 90000, 10, 8181.82, 90000),
(4, 4, 24, 1, 90000, 10, 8181.82, 90000),
(5, 5, 24, 1, 90000, 10, 8181.82, 90000);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animales`
--
ALTER TABLE `animales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `existencias`
--
ALTER TABLE `existencias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `producto_id` (`producto_id`,`deposito_id`);

--
-- Indices de la tabla `impuestos`
--
ALTER TABLE `impuestos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pedidos_usuario` (`usuario_id`),
  ADD KEY `idx_pedidos_estado` (`estado`);

--
-- Indices de la tabla `pedidos_detalles`
--
ALTER TABLE `pedidos_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_detalles_pedido` (`pedido_id`),
  ADD KEY `idx_detalles_producto` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_productos_categoria` (`categoria_id`),
  ADD KEY `idx_productos_uni_med` (`uni_med_id`),
  ADD KEY `idx_productos_slug` (`slug`),
  ADD KEY `idx_productos_estado_stock` (`estado`,`stock`),
  ADD KEY `idx_productos_animales` (`animal_id`),
  ADD KEY `idx_productos_impuestos` (`impuesto_id`) USING BTREE;

--
-- Indices de la tabla `talonarios`
--
ALTER TABLE `talonarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_talonarios_timbrados` (`timbrado_id`);

--
-- Indices de la tabla `timbrados`
--
ALTER TABLE `timbrados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `unidades_medidas`
--
ALTER TABLE `unidades_medidas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_role_active` (`rol`,`is_active`),
  ADD KEY `idx_phone` (`telefono`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ventas_clientes` (`cliente_id`),
  ADD KEY `idx_ventas_talonarios` (`talonario_id`);

--
-- Indices de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `animales`
--
ALTER TABLE `animales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `existencias`
--
ALTER TABLE `existencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `impuestos`
--
ALTER TABLE `impuestos`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos_detalles`
--
ALTER TABLE `pedidos_detalles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `talonarios`
--
ALTER TABLE `talonarios`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `timbrados`
--
ALTER TABLE `timbrados`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `unidades_medidas`
--
ALTER TABLE `unidades_medidas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `pedidos_detalles`
--
ALTER TABLE `pedidos_detalles`
  ADD CONSTRAINT `fk_detalles_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalles_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `fk_productos_unidades_medidas` FOREIGN KEY (`uni_med_id`) REFERENCES `unidades_medidas` (`id`),
  ADD CONSTRAINT `idx_productos_animales` FOREIGN KEY (`animal_id`) REFERENCES `animales` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `fk_ventas_talonarios` FOREIGN KEY (`talonario_id`) REFERENCES `talonarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
