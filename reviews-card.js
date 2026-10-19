// разметка карточки отзыва: одна функция для страницы (index.html) и для генератора (_src/gen.mjs кладет первые 12 карточек прямо в HTML)
(function(w){
  // площадки: название, значок, список отзывов, подпись ссылки, «где» для подписи ответа компании
  var P={
    ym:{n:'Яндекс Карты',logo:'assets/logo-yandex-maps.svg',url:'https://yandex.ru/maps/org/185223809678/reviews/',open:'Открыть на Картах',on:'на Яндекс Картах'},
    g2:{n:'2ГИС',logo:'assets/logo-2gis.png',url:'https://2gis.ru/moscow/firm/70000001094160952/tab/reviews',open:'Открыть в 2ГИС',on:'в 2ГИС'},
    gm:{n:'Google',logo:'assets/logo-google.png',url:'https://www.google.com/maps/search/?api=1&query=Easypay.World',open:'Открыть в Google',on:'в Google'},
    zn:{n:'Zoon',logo:'assets/logo-zoon.png',url:'https://zoon.ru/msk/banks/kompaniya_easypayworld/reviews/',open:'Открыть на Zoon',on:'на Zoon'},
    ot:{n:'Отзовик',logo:'assets/logo-otzovik.png',url:'https://otzovik.com/reviews/karti_easypay_world/',open:'Открыть на Отзовике',on:'на Отзовике'},
    kl:{n:'Клерк',logo:'assets/logo-klerk.svg',url:'https://www.klerk.ru/company/1916/reviews/',open:'Открыть на Клерке',on:'на Клерке'}
  };
  var MON=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var MONN=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  var CN={kz:'Казахстан',kg:'Киргизия',tj:'Таджикистан',tr:'Турция',am:'Армения'};
  var GN={subs:'Подписки и сервисы',travel:'Путешествия',swift:'Фриланс и SWIFT',virt:'Виртуальные карты'};

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ruDate(d){var p=d.split('-');return p.length<3?MONN[+p[1]-1]+' '+p[0]:(+p[2])+' '+MON[+p[1]-1]+' '+p[0]}
  function plural(n,a,b,c){var m=n%10,h=n%100;return m===1&&h!==11?a:m>=2&&m<=4&&(h<10||h>=20)?b:c}
  function stars(n){var s='';for(var i=1;i<=5;i++)s+='<svg class="star'+(i>n?' e':'')+'"><use href="#st"/></svg>';return '<span class="stars" role="img" aria-label="Оценка '+n+' из 5">'+s+'</span>'}

  function card(r){
    var ok=r.src==='order',h='';
    var tags=r.c.map(function(c){return '<span class="tag c">'+CN[c]+'</span>'});
    r.g.forEach(function(g){if(tags.length<4)tags.push('<span class="tag">'+GN[g]+'</span>')});
    r.tags.forEach(function(t){if(tags.length<4&&!/Подписки/.test(t))tags.push('<span class="tag">'+esc(t)+'</span>')});
    var p=P[r.src],badge=p?'<span class="src"><img class="d" src="'+p.logo+'" alt="">'+p.n+'</span>':'';
    var ava=r.ava?'<span class="ava"><img src="'+r.ava+'" alt=""></span>':'<span class="ava">'+esc(r.ini)+'</span>';
    var reply='';
    if(r.reply){
      var note=r.replyNote||('Официальный ответ '+(p?p.on:'')+(r.replyDate?', '+ruDate(r.replyDate):''));
      reply='<div class="reply"><div class="rh"><img src="assets/logo-easypay.png" alt="">Ответ EasyPay</div><p class="rtx">'+esc(r.reply)+'</p><i>'+esc(note)+'</i></div>';
    }
    var foot=ok?'<span>Отзыв из чата с менеджером, согласие на публикацию получено</span>'
      :'<span>Источник: '+p.n+'</span><a href="'+esc(r.url||p.url)+'" target="_blank" rel="noopener">'+(r.url?'Открыть отзыв':p.open)+'<svg class="arr"><use href="#arr"/></svg></a>';
    h+='<article class="rc'+(ok?' ok':'')+'" data-id="'+r.id+'">';
    h+='<div class="rc-in"><div class="rc-top">'+ava+'<span class="who"><b>'+esc(r.name)+'</b>'+(r.sub?'<i>'+esc(r.sub).replace('••','<span class="mask">••</span>')+'</i>':'')+'</span>'+badge+'</div>';
    h+='<div class="rate">'+stars(r.rating)+'<time datetime="'+r.date+'">'+(r.dateText?esc(r.dateText):ruDate(r.date))+(r.edited?', изменен':'')+'</time></div>';
    h+='<p class="txt">'+esc(r.text)+'</p>';
    if(r.photo)h+='<div class="photo"><svg viewBox="0 0 56 40" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="1" width="54" height="38" rx="5"/><path d="M1 11h54"/><path d="M8 29h14"/><circle cx="41" cy="28" r="4"/><circle cx="47" cy="28" r="4"/></svg>Фото карты от клиента, без номера, по согласию</div>';
    // фото из отзыва: миниатюры фиксированного размера (кладка не прыгает), по нажатию фото целиком
    if(r.photos)h+='<div class="rph">'+r.photos.map(function(u,i){return '<a href="'+esc(u)+'" target="_blank" rel="noopener"><img src="'+esc(u)+'" width="84" height="84" loading="lazy" alt="Фото из отзыва '+esc(r.name)+(r.photos.length>1?', '+(i+1)+' из '+r.photos.length:'')+'"></a>'}).join('')+'</div>';
    if(tags.length)h+='<div class="tags">'+tags.join('')+'</div>';
    h+=reply+'<div class="rc-foot">'+foot+'</div></div></article>';
    return h;
  }

  // сначала новые
  function sorted(list){return list.slice().sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:0})}

  // номера страниц: настоящие ссылки ?page=N (первая — без параметра), текущая и раскрытые «Показать еще» — без ссылки
  function pagerHtml(N,PER,page,last){
    var M=Math.max(1,Math.ceil(N/PER)),h='',to=Math.min(N,last*PER);
    if(to<N){var k=Math.min(PER,N-to);h+='<button class="btn white" type="button" data-more>Показать еще '+k+' '+plural(k,'отзыв','отзыва','отзывов')+'<svg class="arr"><use href="#arr"/></svg></button>'}
    if(M>1){
      var pg=[],i;for(i=1;i<=M;i++)if(i===1||i===M||Math.abs(i-page)<=1||(page<=3&&i<=4)||(page>=M-2&&i>=M-3))pg.push(i);
      var prev=0;pg.forEach(function(i){
        if(i-prev>1)h+='<span class="gap">…</span>';
        h+=(i>=page&&i<=last)?'<span class="p" aria-current="page">'+i+'</span>':'<a class="p" href="'+(i===1?'./':'?page='+i)+'" data-page="'+i+'">'+i+'</a>';
        prev=i;
      });
    }
    return h;
  }
  function countHtml(N,PER,page,to,last){
    var M=Math.max(1,Math.ceil(N/PER)),from=(page-1)*PER;
    return !N?'Ничего не найдено':N<=PER?('Показаны <b>все '+N+'</b> '+plural(N,'отзыв','отзыва','отзывов')):('Показаны <b>'+(from+1)+'–'+to+' из '+N+'</b>'+(M>1?', '+(last>page?'страницы '+page+'–'+last:'страница '+page)+' из '+M:''));
  }

  w.RC={P:P,esc:esc,ruDate:ruDate,plural:plural,stars:stars,card:card,sorted:sorted,pagerHtml:pagerHtml,countHtml:countHtml};
})(typeof window!=='undefined'?window:globalThis);
