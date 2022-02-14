document.addEventListener('DOMContentLoaded', function() {
    var boxes = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(boxes);
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    var talents =  document.querySelectorAll('.h120 > div')

    var shares  = document.querySelector('.shares')
    var nshares  = document.querySelector('.nshares')

    var  show = document.querySelector(".showinfos .col") ,
        showinfos = document.querySelector(".showinfos") ,    
        nshowinfos = document.querySelector(".nshowinfos")

    var  sShowmore = ""

    let sloader  = document.querySelector('.sloader')

    let responder  = document.querySelector('.responder')
    let  msg  = document.getElementById("descId")
    responder.onclick =  function(){
        if (!msg.value){
            alert("ادخل ردا  اولا ")
            return
        }
        
        sloader.classList.remove("hide")
        db.collection("responces").where("id" ,  "==" , showinfos.getAttribute("data-id"))
                .get()
                .then((sp)=> {
                    if (sp.size == 0){
                        db.collection("responces").add({
                            id :  showinfos.getAttribute("data-id") , 
                            msg : msg.value 
                        }).then(()=>{
                            
                            sloader.classList.add("hide")
                            alert("تم  ارسال  الرد  يمكنك  تعديله  بنفس الخطوات")
                        })
                    }else {
                        sp.forEach(s=> {
                            s.ref.update({
                                id :  showinfos.getAttribute("data-id") , 
                                msg : msg.value 
                            }).then(()=>{
                                sloader.classList.add("hide")
                                alert("تم تعديل الرد ")
                            })
                        })
                           
                    }
                })
                .catch (e=> {
                    console.log(e)
                })
    }
    var remover  = document.querySelector('.remover')
    remover.onclick =   function(){
        
        sloader.classList.remove("hide")
        db.collection("email").where("id" ,  "==" , this.getAttribute("data-id").substr(1))
                .get()
                .then((sp)=> {
                    sp.forEach(s=> {
                        s.ref.delete().then(()=>{
                            document.getElementById(this.getAttribute("data-id")).remove()
                             alert("تم  المسح بنجاح")   
                             
                             sloader.classList.add("hide")
                             for(let  i  = 0 ; i < 5 ; i ++){
                                storageRef.child('usersshares/'+this.getAttribute("data-id").substr(1)+'_'+i+'.jpg').delete()
                                .then((url) => {
                                    console.log("remove f done ")
                    
                                })
                                .catch((error) => {
                                   console.log("فشل حذف الصور ")
                                });
                            }
                        }).catch(e=>alert("حدث خطأ اثناء المسح"))
                    })
                }).catch (()=> {
                    alert("حدث خطأ اثناء الحذف")
                })
    }

    function updatestat  (e){
        if (e.target.classList.contains("rm")){
            remover.setAttribute("data-id" , this.id)
        }else {
            var sli =  document.querySelectorAll('.shares li')
            sli.forEach(li=> {
                li.classList.remove("active")
            })
            this.classList.add("active")
            
             sloader.classList.remove("hide")
            db.collection("email").where("id" ,  "==" , this.id.substr(1))
                .get()
                .then((sp)=> {
                    msg.value = ""
                    sloader.classList.add("hide")
                    showinfos.classList.remove("hide")
                    nshowinfos.classList.add("hide")
                    sp.forEach(s=> {
                        let  infos = s.data()
                        
                        showinfos.setAttribute("data-id" ,  infos.id)
                        show.innerHTML = `
                        
                        <div class="row">
                          <div class=" description right right-align">
                                <h6></h6>
                                <p style="line-height: 1.8em;"></p>
                            </div>
                        </div>
                        <div class="col s12">
                            <div class="bn right-align  images">
                                <span id ="imd" >جاري الحصول على الصور </span>
                                <div class="progress imloader">
                                        <div class="indeterminate"></div>
                                </div>
                                 
                            </div>
                        </div>
                        <div class="col s12">
                            <div class="reply right-align pointer">
                                <i class="material-icons white-text circle modal-trigger" href="#reply">reply</i>
                            </div>
                        </div>
                    
                        `
                        let  desc  =  document.querySelector(".description") 
                        desc.children[0].innerText = infos.name+" "+infos.sname
                        desc.children[1].innerText = infos.description

                        let  showImage =  document.querySelector(".bn.images")
                        let  img  =  0 , rimg =  false                         
                        for(let  i  = 0 ; i < 5 ; i ++){
                            storageRef.child('usersshares/'+infos.id+'_'+i+'.jpg').getDownloadURL()
                            .then((url) => {
                                img ++ 
                                rimg =  true 
                                if (img ==  4 &&  rimg) {
                                    document.getElementById("imd").innerText = ""
                                    document.querySelector(".imloader").classList.add("hide")
                                  }
                                showImage.innerHTML += `
                                        <div class="col pr s4  xl3">
                                             <img class="materialboxed" width="100%" height="100%" src="${url}">
                                         </div>`
                
                            }).then(()=> {
                                var boxes = document.querySelectorAll('.materialboxed');
                                 M.Materialbox.init(boxes);

                            })
                            .catch((error) => {
                                img ++
                                if (img ==  4 &&  !rimg) {
                                    
                                    document.querySelector(".imloader").classList.add("hide")
                                    document.getElementById("imd").innerText = "لا  يوجد  صور "
                                  }
                                if (img ==  4 &&  rimg) {
                                document.getElementById("imd").innerText = ""
                                document.querySelector(".imloader").classList.add("hide")
                                }
                               console.log("فشل احضار الصور ")
                            });
                        }
                    })
                }).catch ((e)=> {
                    console.log(e)
                    alert("حدث خطأ اثناء جلب المعلومات")
                })
        }
    }

    function addclick(){
        b.forEach(id => {
            document.getElementById(id).onclick = updatestat
        })
    }

    function  createtl (sp, ttype ){
        let  lastid =  "" ; b = []
        sloader.classList.add("hide")
        sp.forEach(s=>{
            let  infos =  s.data() , d =  (new Date(Number(infos.id)))
            shares.firstElementChild.innerHTML += `
            <li  id="d${infos.id}"  class="sharer  transparent mnh  pointer  collection-item avatar" style="border:none;position: relative;">

                <i   class="material-icons circle" style="background-color: #406a667d;">person</i>
                <span class="sf"></span>
                <p class="sf grey-text lighten-2-text">${ d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}</p>
                <a class=" modal-trigger" href="#remover">
                <i  class="material-icons  rm red-text"  style="position:absolute;right:0 ;top:20px"> delete_forever</i>
                </a>
            </li>
            ` 
            document.getElementById("d"+infos.id).children[1].innerText  = infos.name+" "+infos.sname
            b.push("d"+infos.id)
            lastid = s 
        })
        if (sp.size > 0){
                
            shares.firstElementChild.innerHTML += `                   
            <li class="transparent mnh  collection-item center-align" style="border:none;"> 
                <a id="showMore" class="waves-effect pointer waves-light btn-small" style="background-color: #1d7869;">المزيد</a>
            </li>
            `
            sShowmore = document.getElementById("showMore")
            sShowmore.addEventListener("click" , ()=>showmore(ttype ,  lastid))
        }

    }


    function  showmore(ttype , lastid){
        sloader.classList.remove("hide")
        db.collection("email").where("type" , "==" , ttype)
                .orderBy("id" , "desc")
                .startAfter(lastid)
                .limit(15).get()
                .then(sp=> {
                    if (sp.size ==  0){
                        alert("لايوجد  المزيد  من  العناصر")
                    }
                    sShowmore.parentElement.remove()
                    createtl(sp , ttype , 0)
               }).then(addclick).catch(e=> {
                    console.log(e)
                    sloader.classList.add("hide")
                    alert("حدث خطأ ما")
                })
    }
    talents.forEach(talent=> {
        talent.addEventListener("click" , e=> {
                let  ttype =  talent.getAttribute("data-v")
                sloader.classList.remove("hide")
                db.collection("email").where("type" , "==" , ttype).orderBy("id" , "desc")
                    .limit(15).get()
                    .then(sp=> {
                        if(sp.size > 0){
                                                    
                            talents.forEach(talent=>talent.classList.remove("active"))
                            talent.classList.add("active")
                            shares.firstElementChild.innerHTML = ""
                            shares.classList.remove("hide")
                            nshares.classList.add("hide")
                        }else{
                            alert("لا يوجد  مشاركات  في هذا التصنيف")
                        }
                        createtl(sp , ttype)

                     }).then(addclick).catch(e=> {
                        console.log(e)
                        sloader.classList.add("hide")
                        alert("حدث خطأ ما")
                })
        })
    })


    auth.signInWithEmailAndPassword("erraziadmin@targuist.com", "H2up4wsSN3XgcpYLBjNPDa4rmUWGRg")
    .then((userCredential) => {
        try {
            app()
        }catch(e){
            alert('some thing went wrong reload the page and try ')
        }
    })
    .catch((error) => {
       alert("تعذر الوصول الى  لوحة  التحكم  حاول لاحقا ")
    });


    function  app (){
        //for some updates will  be avilable later

    }
 
  });