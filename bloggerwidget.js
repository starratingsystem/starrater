(function() {
	
	function pierdolnij(gdzie, url, ust) {
		let s = document.createElement('script');
		s.src = 'https://drive.google.com/uc?export=download&id=1_3EXmeXQzNkbuQ369vV4li-eLN1mGcOV';
		let nUrl = url.split('?')[0].split('#')[0].replace('http://', '').replace('https://', '').replace('www.', '');
		if (nUrl.substring(nUrl.length-1) === '/' || nUrl.substring(nUrl.length-1) === '.') nUrl = nUrl.substring(0, nUrl.length-1);
		nUrl = nUrl.replace(/\./g, '_').replace(/\//g, '__').replace(/\,/g, '___').replace(/\s/g, '');
		s.setAttribute('ratingName', nUrl);
		for (let k in ust) {
			s.setAttribute(k, ust[k]);
		}
		gdzie.parentNode.insertBefore(s, gdzie.nextSibling);
	}
	
	let majn = document.getElementById('main');
	
	function gotowosc(f) {
		if (/in/.test(document.readyState)) {
			setTimeout(function() {
				gotowosc(f);
			}, 50);
		} else {
			f();
		}
	}
	
	let adres = location.href.split('?')[0].split('#')[0];
	if (/.*\/[12][90][9012][0-9]\/[0-9][0-9]\/.*\.html/.test(adres)) { // post page
		let sel = ['.post-body', '.post-title', 'h1', 'h2', 'h3'];
		let ust = starRatingSystemSettings.postPage;
		
		gotowosc(function() {
			for (let s=0; s<sel.length; s++) {
				if (majn.querySelector(sel[s])) {
					pierdolnij(majn.querySelector(sel[s]), adres, ust);
					break;
				}
			}
		});
	} else if (/.*\/p\/.*\.html/.test(adres)) { // static page
		let sel = ['.post-body', '.post-title', 'h1', 'h2', 'h3'];
		let ust = starRatingSystemSettings.staticPage;
		gotowosc(function() {
			for (let s=0; s<sel.length; s++) {
				if (majn.querySelector(sel[s])) {
					pierdolnij(majn.querySelector(sel[s]), adres, ust);
					break;
				}
			}
		});
	} else { // index page
		let sel = ['.post', '.post-outer', 'article', '.item', '.blog-post', '.hentry', '.index-post'];
		let ust = starRatingSystemSettings.indexPage;
		gotowosc(function() {
			for (let s=0; s<sel.length; s++) {
				if (majn.querySelector(sel[s])) {
					majn.querySelectorAll(sel[s]).forEach(p => {
						let urle = p.querySelectorAll('a[href]');
						if (urle.length) {
							for (let k=0;k<urle.length;k++) {
								let url = urle[k].getAttribute('href').split('?')[0].split('#')[0];
								if (url.indexOf(location.protocol + '//' + location.host) === 0 && /.*\/\d{4}\/\d{2}\/.*\.html/.test(url)) {
									pierdolnij(urle[k], url, ust);
									break;
								} else if (k === urle.length - 1) {
									let gorny = lapUrl(p);
									if (gorny) {
										pierdolnij(gorny, gorny.getAttribute('href'), ust);
									}
								}
							}
						} else {
							let gorny = lapUrl(p);
							if (gorny) {
								pierdolnij(gorny, gorny.getAttribute('href'), ust);
							}
						}
					});
					break;
				} else if (s === sel.length - 1) {
					let zlapane = [];
					urle = majn.querySelectorAll('a[href]');
					urle.forEach(u => {
						let url = u.getAttribute('href').split('?')[0].split('#')[0];
						if (url.indexOf(location.protocol + '//' + location.host) === 0 && /.*\/\d{4}\/\d{2}\/.*\.html/.test(url) && zlapane.indexOf(url) < 0) {
							pierdolnij(u, url, ust);
							zlapane.push(url);
						}
					})
				}
			}
		});
	}

})()
