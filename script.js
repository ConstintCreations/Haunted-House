const inventoryElement = document.querySelector(".inventory");

const items = {
    "flashlight": {
        name: "Flashlight",
        description: "",
        image: "images/testImage.png",
        hasItemFunction: true,
        itemFunction: () => {
            console.log("Using flashlight");
        }
    },
    "test": {
        name: "Test",
        description: "test",
        image: "images/testImage.png",
        hasItemFunction: true,
        itemFunction: () => { console.log("Test"); },
    }
}

let slotItem = {
    item: false,
    name: "",
    description: "",
    image: "",
    hasItemFunction: false,
    itemFunction: () => { return; },
}

let gameData = {
    inventory: [slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem]
};

let selectedSlotIndex;

const keyPromptEElement = document.querySelector(".key-prompt-e");
const keyPromptQElement = document.querySelector(".key-prompt-q");

const itemViewElement = document.querySelector(".item-view");
const itemViewNameElement = itemViewElement.querySelector(".item-view-name");
const itemViewDescriptionElement = itemViewElement.querySelector(".item-view-description");
const itemViewImageElement = itemViewElement.querySelector(".item-view-image");
const itemViewCloseButton = itemViewElement.querySelector(".item-view-close");

itemViewCloseButton.addEventListener("click", () => {
    itemViewElement.style.display = "none";
});

start();

function start() {
    createInventory();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "t") {
        console.log(addItemToInventory("test"));
        console.log(addItemToInventory("flashlight"));
    }
    if (e.key === "x") {
        if (selectedSlotIndex != null) {
            removeItemFromInventory(selectedSlotIndex);
        }
    }
    if (e.key === "u" || e.key === "e") {
        if (selectedSlotIndex != null && gameData.inventory[selectedSlotIndex].hasItemFunction) {
            gameData.inventory[selectedSlotIndex].itemFunction();
        }
    }

    if (e.key === "q") {
        if (selectedSlotIndex != null && itemViewElement.style.display === "none") {
            const slot = gameData.inventory[selectedSlotIndex];
            itemViewNameElement.innerText = slot.name;
            itemViewDescriptionElement.innerText = slot.description;
            itemViewImageElement.src = slot.image;
            itemViewElement.style.display = "flex";
        } else {
            itemViewElement.style.display = "none";
        }
    }

    if (e.key === "i") {
        console.log(gameData.inventory);
        console.log(selectedSlotIndex);
    }
});

function createInventory() {
    gameData.inventory.forEach( (slot, index) => {
        const slotElement = document.createElement("div");
        slotElement.className = "slot";
        const slotIndexElement = document.createElement("b");
        slotIndexElement.innerText = index + 1;
        slotElement.appendChild(slotIndexElement);
        if (slot.item && slot.image != "") {
            const slotImageElement = document.createElement("img");
            slotImageElement.src = slot.image;
            slotElement.appendChild(slotImageElement);
        }
        inventoryElement.appendChild(slotElement);

        document.addEventListener("keydown", (e) => {
            slotKey = (index + 1).toString();
            if (e.key === slotKey) {
                toggleSelectSlot(index);
            }
        });

        slotElement.addEventListener("click", () => {
            toggleSelectSlot(index);
        });
    });

}

function toggleSelectSlot(index) {
    const slot = gameData.inventory[index];
    const slotElements = inventoryElement.querySelectorAll(".slot");
    const slotElement = slotElements[index];
    if (slotElement.classList.contains("selected")) {
            slotElement.classList.remove("selected");
            selectedSlotIndex = null;
            keyPromptEElement.style.display = "none";
            keyPromptQElement.style.display = "none";
        }
    else if (slot.item) {
        slotElements.forEach((element) => {
            element.classList.remove("selected");
        });
        slotElement.classList.add("selected");
        selectedSlotIndex = index;
        keyPromptEElement.style.display = slot.hasItemFunction ? "flex" : "none";
        keyPromptQElement.style.display = "flex";
    }
}

function addItemToInventory(itemKey) {
    const item = items[itemKey];
    if (!item) return false;
    for (let i = 0; i < gameData.inventory.length; i++) {
        if (!gameData.inventory[i].item) {
            gameData.inventory[i] = {
                item: true,
                name: item.name,
                description: item.description,
                image: item.image,
                hasItemFunction: item.hasItemFunction,
                itemFunction: item.itemFunction,
            }
            updateSlotVisual(i);
            return true;
        }
    }
    return false;
}

function updateSlotVisual(index) {
    const slotElements = inventoryElement.querySelectorAll(".slot");
    const slotElement = slotElements[index];
    if (slotElement.querySelector("img")) {
        slotElement.removeChild(slotElement.querySelector("img"));
    }
    const slot = gameData.inventory[index];
    if (slot.item && slot.image != "") {
        const slotImageElement = document.createElement("img");
        slotImageElement.src = slot.image;
        slotElement.appendChild(slotImageElement);
    }
}

function removeItemFromInventory(index) {
    gameData.inventory[index] = slotItem;
    if (index === selectedSlotIndex) {
        toggleSelectSlot(index);
        selectedSlotIndex = null;
    }
    updateSlotVisual(index);
}