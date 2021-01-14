const axios = require("axios");
const deleteBtnAll = document.querySelectorAll("#jsDeleteCommentBtn");
const commentList = document.querySelector("#jsCommentsList");
const commentNumber = document.querySelector("#jsCommentNumber");


function decrementCommentNumber() {
    const numComments = parseInt(commentNumber.innerText.split(" comment")[0]);
    if (numComments === 2) {
        commentNumber.innerText = "1 comment";
    } else {
        commentNumber.innerText = `${numComments - 1} comments`;
    }
}

async function handleDelete(event) {
    const videoId = window.location.href.split("/videos/")[1];
    const commentId = event.target.value;

    console.log(commentId); // CHECK !!!
    const response = await axios({
        url: `/api/${videoId}/${commentId}/delete-comment`,
        method: "DELETE",
    });
    if (response.status === 200) {
        const li = event.target.parentNode.parentNode.parentNode.parentNode;
        li.remove();
        decrementCommentNumber();
    }
}

function init() {
    if(deleteBtnAll.length > 0) {
        const num = deleteBtnAll.length;
        for(let i = 0; i < num; i++) {
            deleteBtnAll[i].addEventListener("click", handleDelete);
        }
    }
}

init();