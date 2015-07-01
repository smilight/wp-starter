<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package kude
 */
?>
</main><!-- #main -->
<footer class="footer-main">
	<div class="footer-main_inner">
		<?php
		if ( is_active_sidebar( 'social_links_footer' ) ) {
			dynamic_sidebar( 'social_links_footer' );
		}
		if ( is_active_sidebar( 'bottom_links_footer' ) ) {
			dynamic_sidebar( 'bottom_links_footer' );
		}
		?>
	</div>
</footer>

<?php wp_footer(); ?>
<script>
	function loadCSS(href){
		var ss = window.document.createElement('link'),
			ref = window.document.getElementsByTagName('head')[0];
		ss.rel = 'stylesheet';
		ss.href = href;
		ss.media = 'only x';
		ref.parentNode.insertBefore(ss, ref);
		setTimeout( function(){
			ss.media = 'all';
		},0);
	}

	function loadJS( src, cb ){
		"use strict";
		var ref = window.document.getElementsByTagName( "script" )[ 0 ];
		var script = window.document.createElement( "script" );
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore( script, ref );
		if (cb && typeof(cb) === "function") {
			script.onload = cb;
		}
		return script;
	}

	loadCSS('<?php bloginfo('template_directory');?>/assets/css/main.css');

	loadJS( "<?php bloginfo('template_directory');?>/assets/js/all.js" );
</script>
<noscript>
	<!-- Let's not assume anything -->
	<link rel="stylesheet" href="<?php bloginfo('template_directory');?>/assets/css/main.css">
</noscript>
</body>
</html>
