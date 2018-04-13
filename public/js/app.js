$(document).ready(function () {

  $("#scrape").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape").then(function () {
      window.location.href = "/";
    });
  })

  $("button.comment").on("click", function () {
    $("#comments").empty();
    var id = $(this).attr("data-id");
    console.log(id);

    $.get("/articles/"+id).then(function (data) {
      console.log(data);
     
      $("#comments").append("<h2>" + data.title + "</h2>");

      $("#comments").append("<input id='titleinput' name='title' >");

      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
    
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      $("#comments").append("<button data-id='" + data.comments[0]._id + "' id='deletecomment'>Delete Comment</button>");

 
      if (data.comments) {
       
        $("#titleinput").val(data.comments[0].title);
 
        $("#bodyinput").val(data.comments[0].body);
      }
    });
  });

  $("button.save").on("click", function () {
    var thisId = $(this).attr("data-id");
    var thisSave = $(this).attr("data-saved");
    $.post("/api/saved/"+ thisId,{saved: thisSave})
      .then(function(data) {
        console.log(data);
    });
        $("#bodyinput").val(data.comments[0].body);
      }
    });
  });

  $("button.save").on("click", function () {
    var thisId = $(this).attr("data-id");
    var thisSave = $(this).attr("data-saved");
    $.post("/api/saved/"+ thisId,{saved: thisSave})
      .then(function(data) {
        console.log(data);
    });
  });

  $(document).on("click", "#savecomment", function () {
    var thisId = $(this).attr("data-id");
    var thisObj = {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    };

    $.post("/articles/" + thisId, thisObj)
      .then(function (data) {
      console.log(data);
      $("#comments").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#deletecomment", function () {
    var thisId = $(this).attr("data-id");
    $("#comments").empty();
    console.log(thisId);
    $.ajax({
      method: "DELETE",
      url: "/articles/" + thisId
    })
    .then(function (data) {
      console.log("deleted");
      $("#notes").empty();
    });
  });

});