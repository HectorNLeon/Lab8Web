function watchForm(){
    loadList();
    $("#postButton").click( function(e){
        let postD = $(".post");
        let body = {};
        body.title = postD[0].value;
        body.content = postD[1].value;
        body.author = postD[2].value;
        body.publishDate = postD[3].value;
        e.preventDefault();
        $.ajax({
            type : 'POST',
            url: '/blog-posts',
            contentType: "application/json",
            data: JSON.stringify(body)
        }).done(function(data){
            console.log(data);
            loadList();
        }).fail(function(msg){
            alert(msg.responseText);
        });
    });

    $("#delButton").click( function(e){
        e.preventDefault();
        if($(".del").val() == ""){
            alert("Missing Id!");
        }
        else{
            $.ajax({
                type : 'DELETE',
                url: '/api/blog-posts/'+$(".del").val()
            }).done(function(data){
                console.log(data);
                loadList();
            }).fail(function(msg){
                alert(msg.responseText);
            });
        }
    });

    $("#updateButton").click( function(e){
        e.preventDefault();
        let postD = $(".update");
        let body = {};
        body.id = postD[0].value
        if(body.id == "")
            return alert("Missing Id!");
        if(postD[1].value != "")
            body.title = postD[1].value;
        if(postD[2].value != "")
            body.content = postD[2].value;
        if(postD[3].value != "")
            body.author = postD[3].value;
        if(postD[4].value != "")
            body.publishDate = postD[4].value;
        $.ajax({
            type : 'PUT',
            url: '/blog-posts/'+body.id,
            contentType: "application/json",
            data: JSON.stringify(body)
        }).done(function(data){
            console.log(data);
            loadList();
        }).fail(function(msg){
            alert(msg.responseText);
        });
    });
}

function loadList(){
    $("#blogList").html("");
    $.ajax({
        type: 'GET',
        url: '/blog-posts'
    }).done(function(data){
        for(let i=0; i<data.length; i++){
            $("#blogList").append("<li>"+JSON.stringify(data[i])+"</li>");
        }
    });
}

watchForm();