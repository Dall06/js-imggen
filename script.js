// globals
let data = []

// methods
const loadJSON = async (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    while (xhr.readyState !== XMLHttpRequest.DONE) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (xhr.status !== 200) {
        throw new Error(`Unable to load JSON file: ${xhr.status}`);
    }
    return JSON.parse(xhr.responseText);
}

const convertDivToImg = (div) => {
    return new Promise((resolve) => {
        html2canvas(div).then((canvas) => {
            const img = new Image();

            img.src = canvas.toDataURL();
            img.id = div.id
            img.onload = () => {
                resolve(img);
            };
        });
    });
};

const downloadAllImages = () => {
    const divImages = document.querySelectorAll('.canvas');
    for (let i = 0; i < divImages.length; i++) {
        downloadImage()
    }
};

const downloadImage = (url, name) => {
    // TODO: implement method
    return new Error("method not implemented")
};

// components
const cardBack = (cardType) => {
    let text = document.createTextNode(cardType.toUpperCase());

    const h1 = document.createElement("h1");
    h1.className = "h1-back";
    h1.appendChild(text);

    let myImg = document.createElement('img');
    // Set the source of the image
    myImg.src = cardType === "reward"
        ? './assets/like.png'
        : './assets/dislike.png';
    // Set the width and height of the image
    myImg.className = "img"

    let div = document.createElement("div");
    div.classList.add(cardType, "card");
    div.appendChild(h1);
    div.appendChild(myImg);

    return div;
};

const cardFront = (cardType, card) => {
    let text = document.createTextNode(card.content);

    const h1 = document.createElement("h1");
    h1.className = "h1-front";
    h1.appendChild(text);

    let content = document.createElement("div");
    content.appendChild(h1);
    content.className = "card-content";

    let div = document.createElement("div");
    div.classList.add(cardType, "card");
    div.id = card.id;
    div.appendChild(content);

    return div;
};

const myButton = () => {
    const button = document.createElement('button'); // Create the button element
    button.setAttribute('type', 'button'); // Set the type attribute to 'button'
    button.setAttribute('id', 'myButton'); // Set the id attribute to 'myButton'
    button.textContent = 'Click to download everything'; // Set the button text content to 'Click me'
    button.addEventListener('click', downloadAllImages);
    return button;
};

// main thread
const view = async (data) => {
    let container = document.getElementById("img-container");

    const button = myButton();
    container.appendChild(button);

    const rewards = data.rewards
    const punishments = data.punishments

    const rewardBack = cardBack("reward");
    container.appendChild(rewardBack);

    convertDivToImg(rewardBack).then((img) => {
        img.className = "canvas"

        container.appendChild(img);
        rewardBack.remove()
    });

    const punishmentBack = cardBack("punishment");
    container.appendChild(punishmentBack);

    convertDivToImg(punishmentBack).then((img) => {
        img.className = "canvas"

        container.appendChild(img);
        punishmentBack.remove()
    });

    rewards.forEach(r => {
        const rewardFront = cardFront("reward", r)
        container.appendChild(rewardFront);

        convertDivToImg(rewardFront).then((img) => {
            img.className = "canvas"

            container.appendChild(img);
            rewardFront.remove()
        });
    });

    punishments.forEach(p => {
        const punishmentFront = cardFront("punishment", p)
        container.appendChild(punishmentFront);

        convertDivToImg(punishmentFront).then((img) => {
            img.className = "canvas"

            container.appendChild(img);
            punishmentFront.remove()
        });
    });
};

async function main() {
    try {
        data = await loadJSON('./data/cards.json');
        await view(data);
    } catch (error) {
        console.error(error);
    }
}

main();





