const inventoryElement = document.querySelector(".inventory");

const items = {
    "flashlight": {
        name: "Flashlight",
        description: "",
        image: "images/testImage.png",
        hasItemFunction: true,
        itemFunction: () => {
            console.log("Using flashlight");
        },
        hasDifferentViewVisual: false,
        viewVisual: ""
    },
    "test": {
        name: "Test",
        description: "test",
        image: "images/testImage.png",
        hasItemFunction: true,
        itemFunction: () => { console.log("Test"); },
        hasDifferentViewVisual: false,
        viewVisual: ""
    },
    "painting": {
        name: "Painting",
        description: "A simple painting of a landscape that has 0176 written on the back.\n I wonder what that could mean?",
        image: "images/rooms/room1/front/objects/painting.png",
        hasItemFunction: false,
        itemFunction: () => { return; },
        hasDifferentViewVisual: true,
        viewVisual: "images/painting-back.png"
    }
}

let slotItem = {
    item: false,
    name: "",
    description: "",
    image: "",
    hasItemFunction: false,
    itemFunction: () => { return; },
    hasDifferentViewVisual: false,
    viewVisual: ""
}

const rooms = {
    1: {
        0: document.querySelector(".room1 .room-front"),
        1: document.querySelector(".room1 .room-left"),
        2: document.querySelector(".room1 .room-back"),
        3: document.querySelector(".room1 .room-right")
    }
}

let gameData = {
    inventory: [slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem, slotItem],
    room: 1,
};

let selectedSlotIndex;
let currentRoomIndex = 0;
let currentObject;

const keyPromptEElement = document.querySelector(".key-prompt-e");
const keyPromptQElement = document.querySelector(".key-prompt-q");

const itemViewElement = document.querySelector(".item-view");
const itemViewNameElement = itemViewElement.querySelector(".item-view-name");
const itemViewDescriptionElement = itemViewElement.querySelector(".item-view-description");
const itemViewImageElement = itemViewElement.querySelector(".item-view-image");
const itemViewCloseButton = itemViewElement.querySelector(".item-view-close");

const timerElement = document.querySelector(".timer");
let time = 5 * 60;

let timerInterval;



function updateTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function gameOver() {

}

itemViewCloseButton.addEventListener("click", () => {
    itemViewElement.style.display = "none";
});

function start() {
    createInventory();
    updateTime();
    timerInterval = setInterval(() => {
        time--;
        if (time < 0) {
            gameOver();
            clearInterval(timerInterval);
            return;
        };
        updateTime();
    }, 1000);
    rooms[gameData.room][currentRoomIndex].style.display = "block";
    fillRooms();
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
            if (slot.hasDifferentViewVisual) {
                itemViewImageElement.src = slot.viewVisual;
            } else {
                itemViewImageElement.src = slot.image;
            }
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
                hasDifferentViewVisual: item.hasDifferentViewVisual,
                viewVisual: item.viewVisual
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
    itemViewElement.style.display = "none";
    gameData.inventory[index] = slotItem;
    if (index === selectedSlotIndex) {
        toggleSelectSlot(index);
        selectedSlotIndex = null;
    }
    updateSlotVisual(index);
}

const objectModalElement = document.querySelector(".object-modal");

const leftArrow = document.querySelector(".room-navigation-left");
const rightArrow = document.querySelector(".room-navigation-right");

leftArrow.addEventListener("click", () => {
    rooms[gameData.room][currentRoomIndex].style.display = "none";
    currentRoomIndex = (currentRoomIndex + 1)%4;
    rooms[gameData.room][currentRoomIndex].style.display = "block";
});

rightArrow.addEventListener("click", () => {
    rooms[gameData.room][currentRoomIndex].style.display = "none";
    currentRoomIndex = (currentRoomIndex - 1)%4;
    if (currentRoomIndex < 0) currentRoomIndex = 3;
    rooms[gameData.room][currentRoomIndex].style.display = "block";
});

let objects = {
    1: {
        0: {
            "door": {
                name: "",
                description: "",
                image: "images/rooms/room1/front/objects/door.png",
                hoverImage: "images/rooms/room1/front/objects/selected/door.png",
                posX: 83,
                posY: 5,
                height: 40,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    openObjectModal("door");
                }
            },
            "drawer": {
                name: "",
                description: "",
                image: "images/rooms/room1/front/objects/drawer.png",
                hoverImage: "images/rooms/room1/front/objects/selected/drawer.png",
                posX: 64,
                posY: 30,
                height: 19,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    console.log("Drawer");
                }
            },
            "painting": {
                name: "",
                description: "",
                image: "images/rooms/room1/front/objects/painting.png",
                hoverImage: "images/rooms/room1/front/objects/selected/painting.png",
                posX: 64,
                posY: 8,
                height: 19,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    if (addItemToInventory("painting")) {
                        selfElement.style.display = "none";
                    }
                }
            },
            "mirror": {
                name: "Mirror",
                description: "A mirror hanging on the wall.",
                image: "images/rooms/room1/front/objects/mirror.png",
                hoverImage: "images/rooms/room1/front/objects/selected/mirror.png",
                posX: 21,
                posY: 8,
                height: 19,
                hasSpecialInteraction: false,
                specialInteraction: (selfElement) => {
                    return;
                }
            },
            "sofa": {
                name: "Sofa",
                description: "A sofa.",
                image: "images/rooms/room1/front/objects/sofa.png",
                hoverImage: "images/rooms/room1/front/objects/selected/sofa.png",
                posX: 21,
                posY: 29,
                height: 20,
                hasSpecialInteraction: false,
                specialInteraction: (selfElement) => { return; }
            },
            "plant": {
                name: "",
                description: "",
                image: "images/rooms/room1/front/objects/plant.png",
                hoverImage: "images/rooms/room1/front/objects/selected/plant.png",
                posX: 3,
                posY: 25,
                height: 24,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    console.log("Plant");
                }
            }
        },
        1: {
            "plant-left": {
                name: "",
                description: "",
                image: "images/rooms/room1/left/objects/plant-left.png",
                hoverImage: "images/rooms/room1/left/objects/selected/plant-left.png",
                posX: 5,
                posY: 6,
                height: 16,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    document.querySelector(".room1 .room-left .room-object[data-object='plant-right']").style.display = "block";
                    selfElement.style.display = "none";
                }
            },
            "plant-right": {
                name: "",
                description: "",
                image: "images/rooms/room1/left/objects/plant-right.png",
                hoverImage: "images/rooms/room1/left/objects/selected/plant-right.png",
                posX: 18,
                posY: 6,
                height: 16,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    document.querySelector(".room1 .room-left .room-object[data-object='plant-left']").style.display = "block";
                    selfElement.style.display = "none";
                }
            },
            "bookshelf": {
                name: "Bookshelf",
                description: "A wooden bookshelf filled with old books.",
                image: "images/rooms/room1/left/objects/bookshelf.png",
                hoverImage: "images/rooms/room1/left/objects/selected/bookshelf.png",
                posX: 86,
                posY: 13,
                height: 34,
                hasSpecialInteraction: false,
                specialInteraction: (selfElement) => {
                    return;
                }
            },
            "chest": {
                name: "",
                description: "",
                image: "images/rooms/room1/left/objects/chest.png",
                hoverImage: "images/rooms/room1/left/objects/selected/chest.png",
                posX: 47,
                posY:  33,
                height: 16,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    console.log("Chest");
                }
            },
            "crack": {
                name: "",
                description: "",
                image: "images/rooms/room1/left/objects/crack.png",
                hoverImage: "images/rooms/room1/left/objects/selected/crack.png",
                posX: 16,
                posY: 44,
                height: 5,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    console.log("Crack");
                }
            }
        },
        2: {},
        3: {}
    }
}

function fillRooms() {
    const roomHeight = 80;
    let roomWidth = 177.7777;
    const screenWidth = window.innerWidth;
    const leftOffsetPixels = (screenWidth - roomWidth * window.innerHeight/100) / 2;

    const hoverImageElement = document.querySelector(".room-selected");

    Object.keys(objects).forEach((roomKey) => {
        const room = objects[roomKey];
        Object.keys(room).forEach((angleKey) => {
            const angleObjects = room[angleKey];
            const roomElement = rooms[roomKey][angleKey];
            Object.keys(angleObjects).forEach((objectKey) => {
                const object = angleObjects[objectKey];
                const objectElement = document.createElement("img");
                objectElement.className = "room-object";
                objectElement.dataset.object = objectKey;
                objectElement.src = object.image;
                objectElement.style.position = "absolute";
                objectElement.style.top = `${((object.posY)/54)*100}%`;
                objectElement.style.left = `calc(${(object.posX/120)*177.7777}vh)`;
                objectElement.style.height = `${(object.height/54)*roomHeight}vh`;
                objectElement.style.transform = `translateX(${leftOffsetPixels}px)`;
                roomElement.appendChild(objectElement);

                objectElement.addEventListener("click", () => {
                    if (object.hasSpecialInteraction) {
                        object.specialInteraction(objectElement);
                    } else {
                        itemViewNameElement.innerText = object.name;
                        itemViewDescriptionElement.innerText = object.description;
                        itemViewImageElement.src = object.image;
                        itemViewElement.style.display = "flex";
                    }
                });

                objectElement.addEventListener("mouseover", () => {
                    if (object.hoverImage) {
                        hoverImageElement.src = object.hoverImage;
                        hoverImageElement.style.display = "block";
                    }
                });

                objectElement.addEventListener("mouseout", () => {
                    hoverImageElement.src = "";
                    hoverImageElement.style.display = "none";
                });
            });
        });
    });
}

function openObjectModal(object) {
    objectModalElement.style.display = "flex";
    const objectContainer = objectModalElement.querySelector(`.object-container.${object}-object`);
    objectContainer.style.display = "flex";
    currentObject = object;
}

function closeObjectModal() {
    objectModalElement.style.display = "none";
    objectModalElement.querySelectorAll(".object-container").forEach((child) => {
        child.style.display = "none";
    });
    currentObject = null;
}

const closeObjectModalButton = objectModalElement.querySelector(".object-modal-close");
closeObjectModalButton.addEventListener("click", () => {
    closeObjectModal();
});

start();

function winGame() {
    console.log("You win!");
}