<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package magnetico
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php bloginfo( 'name' ); ?> | <?php is_home() ? bloginfo( 'name' ) : wp_title( '' ); ?></title>
	<style id="criticalcss"></style>
	<?php wp_head(); ?>
</head>

<?php
$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'thumbnail_size' );
$url = $thumb['0'];
?>
<body <?php body_class(); ?> style="background-image: url(<?php echo $url; ?>)">
<main>
	<header class="header-main">
		<div class="header-main_inner">
			<a href="/" class="logo"></a>
			<label for="mainmenu" class="nav-main_toggler"></label>
			<input type="checkbox" id="mainmenu" class="nav-main_input"/>
			<?php
			wp_nav_menu( array(
				'theme_location'  => '',
				'menu'            => '4',
				'container'       => 'nav',
				'container_class' => 'nav-main',
				'container_id'    => '',
				'menu_class'      => 'menu',
				'menu_id'         => '',
				'echo'            => true,
				'fallback_cb'     => 'wp_page_menu',
				'before'          => '',
				'after'           => '',
				'link_before'     => '',
				'link_after'      => '',
				'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
				'depth'           => 0,
				'walker'          => ''
			) );
			?>
		</div>
	</header>
	<!-- /.header-main -->