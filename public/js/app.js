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
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      $("#comments").append("<button data-id='" + data.comments[0]._id + "' id='deletecomment'>Delete Comment</button>");

      // If there's a note in the article
      if (data.comments) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comments[0].title);
        // Place the body of the note in the body textarea
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