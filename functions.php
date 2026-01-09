add_action('rest_api_init', function () {
  register_rest_route('taveine/v1', '/products', [
    'methods'  => 'GET',
    'callback' => function ($request) {
      $category = sanitize_text_field($request->get_param('category'));

      $url = get_site_url() . "/wp-json/wc/v3/products?category={$category}";
      $args = [
        'headers' => [
          'Authorization' => 'Basic ' . base64_encode(
            'CK_ЗДЕСЬ:CS_ЗДЕСЬ'
          )
        ]
      ];

      $response = wp_remote_get($url, $args);
      return json_decode(wp_remote_retrieve_body($response), true);
    }
  ]);
});
