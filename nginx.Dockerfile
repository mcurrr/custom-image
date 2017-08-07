# create your custom drupal image here, based of official drupal
FROM nginx:1.13.3

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# RUN apt-get update && apt-get install -y git \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /var/www/html/themes

# RUN git clone --branch 8.x-3.x --single-branch --depth 1 https://git.drupal.org/project/bootstrap.git \
#     && chown -R www-data:www-data bootstrap

# WORKDIR /var/www/html
