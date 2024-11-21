docker run -d -p 80:80 -p 443:443 --name nginx-proxy  --network h5shop --privileged=true \
  -e ENABLE_IPV6=true \
  -v ~/nginx/vhost.d:/etc/nginx/vhost.d \
  -v ~/nginx-certs:/etc/nginx/certs:ro \
  -v ~/nginx-conf:/etc/nginx/conf.d \
  -v ~/nginx-logs:/var/log/nginx \
  -v /usr/share/nginx/html \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy


docker run -d --privileged=true --network h5shop \
  -v ~/nginx/vhost.d:/etc/nginx/vhost.d \
  -v ~/nginx-certs:/etc/nginx/certs:rw \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --volumes-from nginx-proxy \
  jrcs/letsencrypt-nginx-proxy-companion
