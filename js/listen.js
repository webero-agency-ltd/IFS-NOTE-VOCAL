//mini plugin jquery pour ajouter un event play adu audio 
jQuery.createEventCapturing = (function () {
    var special = jQuery.event.special;
    return function (names) {
        if (!document.addEventListener) {
            return;
        }
        if (typeof names == 'string') {
            names = [names];
        }
        jQuery.each(names, function (i, name) {
            var handler = function (e) {
                e = jQuery.event.fix(e);
                return jQuery.event.dispatch.call(this, e);
            };
            special[name] = special[name] || {};
            if (special[name].setup || special[name].teardown) {
                return;
            }
            jQuery.extend(special[name], {
                setup: function () {
                    this.addEventListener(name, handler, true);
                },
                teardown: function () {
                    this.removeEventListener(name, handler, true);
                }
            });
        });
    };
})();

class listen {

    constructor( content , url , id , html ) {
        let c = null ;
        typeof( content ) == 'object'?c=content:c=document.getElementById(content)
        if ( c ) {
            //var au = document.createElement('audio');
            //au.controls = true;
            //au.src = url;
            let tpl = this.init( id , url , html ) ;
            c.innerHTML=tpl ; 
            return true
        }
        return false
    }

    static
    event(){

         /*
         * Pour tout les lecteurs audio de l'application 
         * écoute evenement changement vitesse de lecteur audio 
         * et faire les manipulation qui va avec 
        */
        $('body').on('click','.speed-fan',function ( e ) {
            e.stopPropagation() ; 
            e.preventDefault() ;
            let el = $( this ) ; 
            let id = el.data('id') ; 
            let value = el.data('value') ;
            let od = document.getElementById( id ) ; 
            od.playbackRate = value ; 
            $('.'+id+'core .speed-fan').removeClass('active') ; 
            el.addClass('active') ; 
        })

        //si le lécteur audio est en play, on affiche son 
        $.createEventCapturing(['play','pause']);  
        $('body').on('play', 'audio', function(){
            let el = $( this ) ; 
            let id = el.data('id') ; 
            let elCtrl = $('.'+id) ;
            elCtrl.show() ; 

            console.log( 'PLAY LISTEN ' )
        })
        
        $('body').on('pause', 'audio', function(){
            let el = $( this ) ; 
            let id = el.data('id') ; 
            let elCtrl = $('.'+id) ;
            elCtrl.hide() ;  
        })
        
    }

    init( id , url , html = '' ) {
        console.log( html )
        let thas = this ; 
        let tpl = `<div class="${id}core"  class="audio-controller" >
            <audio data-id="${id}" id="${id}" style="width: 100%; margin-top: 20px;" controls="" >
                <source  src="${url}"  type="audio/mpeg">
            </audio>
            <div class="${id}" style="padding-left: 21px; display:none ; height: 30px;" >
                <a data-id="${id}" data-value="1" class="active speed-fan" href="#"><span>x 1</span></a>
                <a data-id="${id}" data-value="1.25" class="speed-fan" href="#"><span>x 1.25</span></a>
                <a data-id="${id}" data-value="1.50" class="speed-fan" href="#"><span>x 1.50</span></a>
                <a data-id="${id}" data-value="2" class="speed-fan" href="#"><span>x 2</span></a>
            </div>
            <style>
                a.speed-fan{
                    color : #b5b5b5 ; 
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 0.51rem;
                    margin-right: 0.51rem;
                }
                a.speed-fan.active{
                    color : #121212 ; 
                }
            </style>
        </div>${html}`;
        return tpl ; 

    }
}