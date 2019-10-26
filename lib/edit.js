$(function () {
    $("#flexbox_cent_line").draggable({
        axis: "x",
        containment: $(".flexbox_container"),
        start: function (e, ui) {
            $(this).addClass('dragging');
        },

        drag: function (e, ui) {
            if (ui.helper[0].id === "flexbox_cent_line") {
                $("#flexbox_rght_pane").css("flex", "1");
                $("#flexbox_left_pane").css("flex", "0 1 " + (ui.offset.left) + "px");
            }
        },
        stop: function (event, ui) {
            $(this).removeClass('dragging');
        }

    });
});

