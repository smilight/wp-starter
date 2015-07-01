<?php
/**
 * kude functions and definitions
 *
 * @package kude
 */

function headClean() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'wp_wlwmanifest' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
}

function kude_assets() {
	$assetsPath = get_template_directory_uri() . '/assets/';
//	wp_enqueue_style( 'main', $assetsPath . 'css/main.css', array(), '1.0.0' );
//	wp_enqueue_style( 'style-name', $assetsPath . 'css/main.css', array(), '1.0.0', true );
//	wp_enqueue_script( 'script-name', get_template_directory_uri() . '/js/example.js', array(), '1.0.0', true );
}

add_action('init', 'headClean');

function kude_setup() {
	add_theme_support( 'post-formats', array( 'aside', 'gallery' ) );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'post-thumbnails', array( 'post' ) );
	add_theme_support( 'post-thumbnails', array( 'page' ) );
}
add_action( 'after_setup_theme', 'kude_setup' );


add_action( 'wp_enqueue_scripts', 'kude_assets' );

if (function_exists('register_sidebar')) {
	register_sidebar(array(
		'name'=> 'Footer bottom Links',
		'id' => 'bottom_links_footer',
		'before_widget' => '<nav id="%1$s" class="widget %2$s nav-footer_bottom">',
		'after_widget' => '</nav>',
		'before_title' => '<span style="display: none;">',
		'after_title' => '</span>',
	));
	register_sidebar(array(
		'name'=> 'Footer social Links',
		'id' => 'social_links_footer',
		'before_widget' => '<nav id="%1$s" class="widget %2$s nav-footer_social">',
		'after_widget' => '</nav>',
		'before_title' => '<span style="display: none;">',
		'after_title' => '</span>',
	));
}