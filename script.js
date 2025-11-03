const inventoryElement = document.querySelector(".inventory");

document.querySelector(".crack-object-image").dataset.lit = "false";
document.querySelector(".crack-object-key").dataset.taken = "false";


const items = {
    "flashlight": {
        name: "Flashlight",
        description: "Can be used to light up dark areas.",
        image: "images/items/flashlight.png",
        hasItemFunction: true,
        itemFunction: () => {
            if (currentObject === "crack") {
                crackElement = document.querySelector(".crack-object-image");
                if (crackElement.dataset.lit == "false") {
                    crackElement.src = "images/modal-object/crack-light.png";
                    crackElement.dataset.lit = "true";
                    crackKeyElement = document.querySelector(".crack-object-key");
                    if (crackKeyElement.dataset.taken == "false") {
                        crackKeyElement.style.display = "block";
                    }
                } else {
                    crackElement.src = "images/modal-object/crack.png";
                    crackElement.dataset.lit = "false";
                    crackKeyElement = document.querySelector(".crack-object-key");
                    crackKeyElement.style.display = "none";
                }
            }
        },
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
    },
    "crack-key": {
        name: "Small Key",
        description: "A small key that was hidden in a hole in the floor.",
        image: "images/items/crack-key.png",
        hasItemFunction: true,
        itemFunction: () => { 
            if (currentObject === "chest") {
                const chestElement = document.querySelector(".chest-object-image");
                chestElement.src = "images/modal-object/chest-open.png";
                const chestItemElement = document.querySelector(".chest-object-item");
                chestItemElement.style.display = "block";
            }
        },
        hasDifferentViewVisual: false,
        viewVisual: ""
    },
    "screwdriver": {
        name: "Screwdriver",
        description: "A flathead screwdriver.",
        image: "images/items/screwdriver.png",
        hasItemFunction: true,
        itemFunction: () => { 
            if (currentObject === "vent") {
                const ventElement = document.querySelector(".vent-object-image");
                ventElement.src = "images/modal-object/vent-open.png";
                const ventItemElement = document.querySelector(".vent-object-item");
                ventItemElement.style.display = "block";
            }
        },
        hasDifferentViewVisual: false,
        viewVisual: ""
    },
    "note": {
        name: "Note",
        description: "A note that reads: 'Maybe count the books on the bookshelf.'",
        image: "images/items/note.png",
        hasItemFunction: false,
        itemFunction: () => { return; },
        hasDifferentViewVisual: false,
        viewVisual: ""
    },
    "exit-key": {
        name: "Exit Key",
        description: "A key that looks like it could open a door.",
        image: "images/items/exit-key.png",
        hasItemFunction: true,
        itemFunction: () => {
            if (currentObject === "door") {
                winGame();
            }
        },
        hasDifferentViewVisual: false,
        viewVisual: ""
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
    inventory: [slotItem, slotItem, slotItem, slotItem, slotItem, slotItem],
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
    if (e.key === "e") {
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
                    openObjectModal("drawer");
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
                description: "A comfy looking sofa.",
                image: "images/rooms/room1/front/objects/sofa.png",
                hoverImage: "images/rooms/room1/front/objects/selected/sofa.png",
                posX: 21,
                posY: 29,
                height: 20,
                hasSpecialInteraction: false,
                specialInteraction: (selfElement) => { return; }
            },
            "plant": {
                name: "Plant",
                description: "Just a regular plant.",
                image: "images/rooms/room1/front/objects/plant.png",
                hoverImage: "images/rooms/room1/front/objects/selected/plant.png",
                posX: 3,
                posY: 25,
                height: 24,
                hasSpecialInteraction: false,
                specialInteraction: (selfElement) => {
                    return;
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
                    openObjectModal("chest");
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
                    openObjectModal("crack");
                }
            }
        },
        2: {
            "vent": {
                name: "",
                description: "",
                image: "images/rooms/room1/back/objects/vent.png",
                hoverImage: "images/rooms/room1/back/objects/selected/vent.png",
                posX: 40,
                posY: 33,
                height: 10,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    openObjectModal("vent");
                }
            },
            "back-safe": {
                name: "",
                description: "",
                image: "images/rooms/room1/back/objects/back-safe.png",
                hoverImage: "images/rooms/room1/back/objects/selected/back-safe.png",
                posX: 61,
                posY: 31,
                height: 15,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    openObjectModal("back-safe", "");
                }
            }
        },
        3: {
            "vault": {
                name: "",
                description: "",
                image: "images/rooms/room1/right/objects/vault.png",
                hoverImage: "images/rooms/room1/right/objects/selected/vault.png",
                posX: 37,
                posY:  19,
                height: 27,
                hasSpecialInteraction: true,
                specialInteraction: (selfElement) => {
                    openObjectModal("vault");
                }
            }
        }
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

const safeNumberElements = document.querySelectorAll(".safe-number");
safeNumberElements.forEach((element) => {
    element.dataset.value = "0";
});

function updateSafe(pos, amount) {
    const element = safeNumberElements[pos];
    let value = parseInt(element.dataset.value);
    value = (value + amount)%10;
    if (value < 0) value = 9;
    element.dataset.value = value.toString();
    element.innerText = value.toString();
    checkSafeCode();
}

function checkSafeCode() {
    const code = Array.from(safeNumberElements).map( (el) => el.dataset.value).join("");
    if (code === "0176") {
        document.querySelector(".safe-inputs").remove();
        const backSafeElement = document.querySelector(".back-safe-object-image");
        backSafeElement.src = "images/modal-object/back-safe-open.png";
        const backSafeItemElement = document.querySelector(".back-safe-object-item");
        backSafeItemElement.style.display = "block";
    }
}

const vaultNumberElements = document.querySelectorAll(".vault-number");
vaultNumberElements.forEach((element) => {
    element.dataset.value = "0";
});

function updateVault(pos, amount) {
    const element = vaultNumberElements[pos];
    let value = parseInt(element.dataset.value);
    value = (value + amount)%10;
    if (value < 0) value = 9;
    element.dataset.value = value.toString();
    element.innerText = value.toString();
    checkVaultCode();
}

function checkVaultCode() {
    const code = Array.from(vaultNumberElements).map( (el) => el.dataset.value).join("");
    if (code === "52932648") {
        document.querySelectorAll(".vault-inputs").forEach((element) => {element.remove()});
        const backSafeElement = document.querySelector(".vault-object-image");
        backSafeElement.src = "images/modal-object/vault-open.png";
        const backSafeItemElement = document.querySelector(".vault-object-item");
        backSafeItemElement.style.display = "block";
    }
}