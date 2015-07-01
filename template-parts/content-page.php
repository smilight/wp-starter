<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package kude
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
	<div class="inner_content">
		<header class="entry-header">
			<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
		</header>
		<div class="entry-content">
			<?php the_content(); ?>
			<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'kude' ),
				'after'  => '</div>',
			) );
			?>
		</div>

		<footer class="entry-footer">
			<?php edit_post_link( esc_html__( 'Edit', 'kude' ), '<span class="edit-link">', '</span>' ); ?>
		</footer>

	</div>
</article>
