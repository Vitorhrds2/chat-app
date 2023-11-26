const socket = new WebSocket('ws://localhost:4000');
const chatWindow = document.getElementById('chat-messages');

const nameInput = document.getElementById('name-input');
const userNameDisplay = document.getElementById('user-name-display');

const messageInput = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const sendButton = document.getElementById('send-button');

const emojiButton = document.getElementById('emoji-button');
const emojiContainer = document.getElementById('emoji-container');

emojiButton.addEventListener('click', () => {
  emojiContainer.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (event.target !== emojiButton && event.target !== emojiContainer) {
    emojiContainer.classList.remove('open');
  }
});


let emojisRendered = false;

emojiButton.addEventListener('click', () => {
  emojiContainer.style.display = emojiContainer.style.display === 'block' ? 'none' : 'block';
  if (!emojisRendered) {
    renderEmojis();
    emojisRendered = true;
  }
});

const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '☺', '🙂', '🤗', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '🤓', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '😇', '🤠', '🤡', '🤥', '😷', '🤒', '🤕', '🤢', '🤧', '😈', '👿', '👹', '👺', '💀', '☠', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '👩', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👴', '👴🏻', '👴🏼', '👴🏽', '👴🏾', '👴🏿', '👵', '👵🏻', '👵🏼', '👵🏽', '👵🏾', '👵🏿', '👶', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿', '👼', '👼🏻', '👼🏼', '👼🏽', '👼🏾', '👼🏿', '👮', '👮🏻', '👮🏼', '👮🏽', '👮🏾', '👮🏿', '🕵', '🕵🏻', '🕵🏼', '🕵🏽', '🕵🏾', '🕵🏿', '💂', '💂🏻', '💂🏼', '💂🏽', '💂🏾', '💂🏿', '👷', '👷🏻', '👷🏼', '👷🏽', '👷🏾', '👷🏿', '👳', '👳🏻', '👳🏼', '👳🏽', '👳🏾', '👳🏿', '👱', '👱🏻', '👱🏼', '👱🏽', '👱🏾', '👱🏿', '🎅', '🎅🏻', '🎅🏼', '🎅🏽', '🎅🏾', '🎅🏿', '🤶', '🤶🏻', '🤶🏼', '🤶🏽', '🤶🏾', '🤶🏿', '👸', '👸🏻', '👸🏼', '👸🏽', '👸🏾', '👸🏿', '🤴', '🤴🏻', '🤴🏼', '🤴🏽', '🤴🏾', '🤴🏿', '👰', '👰🏻', '👰🏼', '👰🏽', '👰🏾', '👰🏿', '🤵', '🤵🏻', '🤵🏼', '🤵🏽', '🤵🏾', '🤵🏿', '🤰', '🤰🏻', '🤰🏼', '🤰🏽', '🤰🏾', '🤰🏿', '👲', '👲🏻', '👲🏼', '👲🏽', '👲🏾', '👲🏿', '🙍', '🙍🏻', '🙍🏼', '🙍🏽', '🙍🏾', '🙍🏿', '🙎', '🙎🏻', '🙎🏼', '🙎🏽', '🙎🏾', '🙎🏿', '🙅', '🙅🏻', '🙅🏼', '🙅🏽', '🙅🏾', '🙅🏿', '🙆', '🙆🏻', '🙆🏼', '🙆🏽', '🙆🏾', '🙆🏿', '💁', '💁🏻', '💁🏼', '💁🏽', '💁🏾', '💁🏿', '🙋', '🙋🏻', '🙋🏼', '🙋🏽', '🙋🏾', '🙋🏿', '🙇', '🙇🏻', '🙇🏼', '🙇🏽', '🙇🏾', '🙇🏿', '🤦', '🤦🏻', '🤦🏼', '🤦🏽', '🤦🏾', '🤦🏿', '🤷', '🤷🏻', '🤷🏼', '🤷🏽', '🤷🏾', '🤷🏿', '💆', '💆🏻', '💆🏼', '💆🏽', '💆🏾', '💆🏿', '💇', '💇🏻', '💇🏼', '💇🏽', '💇🏾', '💇🏿', '🚶', '🚶🏻', '🚶🏼', '🚶🏽', '🚶🏾', '🚶🏿', '🏃', '🏃🏻', '🏃🏼', '🏃🏽', '🏃🏾', '🏃🏿', '💃', '💃🏻', '💃🏼', '💃🏽', '💃🏾', '💃🏿', '🕺', '🕺🏻', '🕺🏼', '🕺🏽', '🕺🏾', '🕺🏿', '👯', '🕴', '🗣', '👤', '👥', '🤺', '🏇', '⛷', '🏂', '🏌', '🏄', '🏄🏻', '🏄🏼', '🏄🏽', '🏄🏾', '🏄🏿', '🚣', '🚣🏻', '🚣🏼', '🚣🏽', '🚣🏾', '🚣🏿', '🏊', '🏊🏻', '🏊🏼', '🏊🏽', '🏊🏾', '🏊🏿', '⛹', '⛹🏻', '⛹🏼', '⛹🏽', '⛹🏾', '⛹🏿', '🏋', '🏋🏻', '🏋🏼', '🏋🏽', '🏋🏾', '🏋🏿', '🚴', '🚴🏻', '🚴🏼', '🚴🏽', '🚴🏾', '🚴🏿', '🚵', '🚵🏻', '🚵🏼', '🚵🏽', '🚵🏾', '🚵🏿', '🏎', '🏍', '🤸', '🤸🏻', '🤸🏼', '🤸🏽', '🤸🏾', '🤸🏿', '🤼', '🤼🏻', '🤼🏼', '🤼🏽', '🤼🏾', '🤼🏿', '🤽', '🤽🏻', '🤽🏼', '🤽🏽', '🤽🏾', '🤽🏿', '🤾', '🤾🏻', '🤾🏼', '🤾🏽', '🤾🏾', '🤾🏿', '🤹', '🤹🏻', '🤹🏼', '🤹🏽', '🤹🏾', '🤹🏿', '👫', '👬', '👭', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '🏻', '🏼', '🏽', '🏾', '🏿', '💪', '💪🏻', '💪🏼', '💪🏽', '💪🏾', '💪🏿', '🤳', '🤳🏻', '🤳🏼', '🤳🏽', '🤳🏾', '🤳🏿', '👈', '👈🏻', '👈🏼', '👈🏽', '👈🏾', '👈🏿', '👉', '👉🏻', '👉🏼', '👉🏽', '👉🏾', '👉🏿', '☝', '☝🏻', '☝🏼', '☝🏽', '☝🏾', '☝🏿', '👆', '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿', '🖕', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '👇', '👇🏻', '👇🏼', '👇🏽', '👇🏾', '👇🏿', '✌', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', '🤞', '🤞🏻', '🤞🏼', '🤞🏽', '🤞🏾', '🤞🏿', '🖖', '🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿', '🤘', '🤘🏻', '🤘🏼', '🤘🏽', '🤘🏾', '🤘🏿', '🤙', '🤙🏻', '🤙🏼', '🤙🏽', '🤙🏾', '🤙🏿', '🖐', '🖐🏻', '🖐🏼', '🖐🏽', '🖐🏾', '🖐🏿', '✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', '👌', '👌🏻', '👌🏼', '👌🏽', '👌🏾', '👌🏿', '👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿', '👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿', '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿', '👊', '👊🏻', '👊🏼', '👊🏽', '👊🏾', '👊🏿', '🤛', '🤛🏻', '🤛🏼', '🤛🏽', '🤛🏾', '🤛🏿', '🤜', '🤜🏻', '🤜🏼', '🤜🏽', '🤜🏾', '🤜🏿', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿', '👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿', '👏', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿', '✍', '✍🏻', '✍🏼', '✍🏽', '✍🏾', '✍🏿', '👐', '👐🏻', '👐🏼', '👐🏽', '👐🏾', '👐🏿', '🙌', '🙌🏻', '🙌🏼', '🙌🏽', '🙌🏾', '🙌🏿', '🙏', '🙏🏻', '🙏🏼', '🙏🏽', '🙏🏾', '🙏🏿', '🤝', '🤝🏻', '🤝🏼', '🤝🏽', '🤝🏾', '🤝🏿', '💅', '💅🏻', '💅🏼', '💅🏽', '💅🏾', '💅🏿', '👂', '👂🏻', '👂🏼', '👂🏽', '👂🏾', '👂🏿', '👃', '👃🏻', '👃🏼', '👃🏽', '👃🏾', '👃🏿', '👣', '👀', '👁', '👁‍🗨', '👅', '👄', '💋', '💘', '❤', '💓', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '💜', '🖤', '💝', '💞', '💟', '❣', '💌', '💤', '💢', '💣', '💥', '💦', '💨', '💫', '💬', '🗨', '🗯', '💭', '🕳', '👓', '🕶', '👔', '👕', '👖', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '⛑', '📿', '💄', '💍', '💎', '🐵', '🐒', '🦍', '🐶', '🐕', '🐩', '🐺', '🦊', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦌', '🦄', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🦏', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦇', '🐻', '🐨', '🐼', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🦅', '🦆', '🦉', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🦀', '🦐', '🦑', '🦋', '🐌', '🐛', '🐜', '🐝', '🐞', '🕷', '🕸', '🦂', '💐', '🌸', '💮', '🏵', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥞', '🧀', '🍖', '🍗', '🥓', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🥙', '🥚', '🍳', '🥘', '🍲', '🥗', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🍽', '🍴', '🥄', '🔪', '🏺', '🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🏘', '🏙', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁', '🌃', '🌄', '🌅', '🌆', '🌇', '🌉', '♨', '🌌', '🎠', '🎡', '🎢', '💈', '🎪', '🎭', '🖼', '🎨', '🎰', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🚲', '🛴', '🛵', '🚏', '🛣', '🛤', '⛽', '🚨', '🚥', '🚦', '🚧', '🛑', '⚓', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '💺', '🚁', '🚟', '🚠', '🚡', '🚀', '🛰', '🛎', '🚪', '🛌', '🛏', '🛋', '🚽', '🚿', '🛀', '🛀🏻', '🛀🏼', '🛀🏽', '🛀🏾', '🛀🏿', '🛁', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡', '☀', '🌝', '🌞', '⭐', '🌟', '🌠', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '🌀', '🌈', '🌂', '☂', '☔', '⛱', '⚡', '❄', '☃', '⛄', '☄', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎾', '🎱', '🎳', '🏏', '🏑', '🏒', '🏓', '🏸', '🥊', '🥋', '🥅', '🎯', '⛳', '⛸', '🎣', '🎽', '🎿', '🎮', '🕹', '🎲', '♠', '♥', '♦', '♣', '🃏', '🀄', '🎴', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙', '🎚', '🎛', '🎤', '🎧', '📻', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '📱', '📲', '☎', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🔬', '🔭', '📡', '🕯', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '💹', '💱', '💲', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '⛏', '⚒', '🛠', '🗡', '⚔', '🔫', '🏹', '🛡', '🔧', '🔩', '⚙', '🗜', '⚗', '⚖', '🔗', '⛓', '💉', '💊', '🚬', '⚰', '⚱', '🗿', '🛢', '🔮', '🛒', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢', '☣', '⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖', '↕', '↔', '↩', '↪', '⤴', '⤵', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛', '🕉', '✡', '☸', '☯', '✝', '☦', '☪', '☮', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶', '⏩', '⏭', '⏯', '◀', '⏪', '⏮', '🔼', '⏫', '🔽', '⏬', '⏸', '⏹', '⏺', '⏏', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♻', '📛', '⚜', '🔰', '🔱', '⭕', '✅', '☑', '✔', '✖', '❌', '❎', '➕', '➖', '➗', '➰', '➿', '〽', '✳', '✴', '❇', '‼', '⁉', '❓', '❔', '❕', '❗', '〰', '©', '®', '™', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '💯', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰', '🆎', '🅱', '🆑', '🆒', '🆓', 'ℹ', '🆔', 'Ⓜ', '🆕', '🆖', '🅾', '🆗', '🅿', '🆘', '🆙', '🆚', '🈁', '🈂', '🈷', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗', '㊙', '🈺', '🈵', '▪', '▫', '◻', '◼', '◽', '◾', '⬛', '⬜', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔲', '🔳', '⚪', '⚫', '🔴', '🔵', '🏁', '🚩', '🎌', '🏴', '🏳'];

function renderEmojis() {
  const emojiContainer = document.getElementById("emoji-container");
  emojis.forEach((emoji) => {
    const emojiButton = document.createElement('span');
    emojiButton.style.cursor = 'pointer';
    emojiButton.textContent = emoji;
    emojiButton.addEventListener('click', () => {
      // Insira o emoji no campo de entrada de mensagens
      messageInput.value += emoji;
    });
    emojiContainer.appendChild(emojiButton);
  });
}



let userName = '';
const messageHistory = [];

function conectarUsuario() {
  const name = nameInput.value.trim();

  userName = name;
  userNameDisplay.textContent = userName;
  nameInput.classList.add('hidden');

  enviarMensagemEspecial(`${userName} entrou no chat` );

  messageHistory.push({
    type: 'system',
    message: `${userName} entrou no chat`,
  });

  socket.send(JSON.stringify({ type: 'get_messages', userName }));

  updateChatUI();
}

function enviarMensagem(sender, message, file) {

    appendMessage(sender, message, 'own');
    enviarMensagemNormal(userName, message);
    messageInput.value = '';
  

  const messageObject = {
    type: 'message',
    sender,
    message,
    file: null,
    isImage: false,
  };

  if (file) {
    const fileContent = file.buffer; // Use o conteúdo do arquivo em buffer
    messageObject.file = {
      name: file.originalname,
      content: fileContent,
    };
    messageObject.isImage = file.mimetype.startsWith('image/'); // Verifique se o arquivo é uma imagem

    reader.readAsArrayBuffer(file);
  } else if (message) {
    socket.send(JSON.stringify(messageObject));
  }
}

function enviarMensagemEspecial(message) {
  socket.send(JSON.stringify({ sender: 'Sistema', message: `sys|${message}` }));
  if (message && message.message && message.message.startsWith(`${userName} mudou o nome para `)) {
    const newName = message.message.split(' para ')[1];
    updateMessageHistory(userName, newName);
    userName = newName;
    userNameDisplay.textContent = newName;
  }
}

function enviarMensagemNormal(sender, message) {

    // Enviar a mensagem para o servidor backend
    fetch('http://127.0.0.1:3000/api/mensagens/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, message }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        console.log("DEU CERTO");
        // Faça algo aqui, se necessário, após a mensagem ser salva no banco de dados.
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem para o servidor backend:', error);
      });
}

nameInput.addEventListener('blur', () => {
  const newName = nameInput.value.trim();
  if (newName !== userName) {
    enviarMensagemEspecial(`${userName} mudou o nome para ${newName}`);
    userName = newName;
    userNameDisplay.textContent = newName;
    updateMessageHistory(userName, newName);

    // Chamar a função para consultar as mensagens do usuário
    consultarMensagensDoUsuario(userName); // <--- Adicionar essa linha aqui
  }
});

document.getElementById('user-name-display').addEventListener('click', () => {
  nameInput.classList.remove('hidden');
  nameInput.focus();
});

document.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    if (nameInput === document.activeElement) {
      messageInput.focus();
    }
  }
});

// Evento de envio do formulário (mudanças aqui)
document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que o formulário seja enviado normalmente

  const file = fileInput.files[0];
  const message = messageInput.value;

  if (message.trim() !== '' || file) {
    // Enviar mensagem normal, incluindo arquivo se presente
    enviarMensagem(userName, message, file);
  }

  messageInput.value = ''; // Limpar o campo de mensagem após o envio
});

sendButton.addEventListener("click", enviarMensagem);

// Lidar com mensagens recebidas via WebSocket
socket.addEventListener('message', (event) => {
  const messageData = JSON.parse(event.data);

  if (messageData.message.startsWith('sys|')) {
    appendMessage('Sistema', messageData.message, 'system');
  } else if (messageData.type === 'get_messages') {
    consultarMensagensDoUsuario(messageData.userName);
  } else if (messageData.type === 'message') {
    const messageType = messageData.sender === userName ? 'own' : 'other';
    appendMessage(messageData.sender, messageData.message, messageType);
  } else if (messageData.type === 'file') {
    handleReceivedFile(messageData);
  } else {
    console.warn('Tipo de mensagem desconhecido:', messageData.type);
  }
  scrollToBottom();
});

// Função para lidar com o recebimento de arquivos
function handleReceivedFile(messageData) {
  const { sender, file } = messageData;
  if (file) {
    const fileLink = document.createElement('a');
    fileLink.href = `http://localhost:4000/uploads/${file.name}`; // Altere o caminho conforme necessário
    fileLink.download = file.name;
    fileLink.textContent = `Baixar ${file.name}`;
    fileLink.classList.add('file-link'); // Adicione a classe de estilo, se necessário
    appendMessage(sender, fileLink.outerHTML, 'other');
  }
}


function appendMessage(sender, message, messageType) {
  const messageContainer = document.createElement('div');
  messageContainer.className = `message-container ${messageType}`;

  const messageElement = document.createElement('div');
  messageElement.className = `message-container ${sender === userName ? 'own' : 'other'}`;

  if (message.startsWith('sys|')) {
    messageElement.innerHTML = `
      <div class="message system">
        <strong class="sender">${message.substring(4)}</strong>
      </div>
    `;
  } else {
    if (sender === 'Sistema' && message && message.includes('mudou o nome para')) {
      messageElement.innerHTML = `
        <div class="message system">
          <strong class="sender">${message}</strong>
        </div>
      `;
    } else {
      if (message.startsWith('data:')) {
        // Verificar se a mensagem é um link para arquivo embutido
        const embeddedContent = createEmbeddedContent(message);
        if (embeddedContent) {
          messageElement.appendChild(embeddedContent);
        } else {
          // Se não for reconhecido como conteúdo embutido, exibir como link de download
          const downloadLink = document.createElement('a');
          downloadLink.href = message;
          downloadLink.textContent = 'Baixar arquivo';
          downloadLink.target = '_blank';
          messageElement.appendChild(downloadLink);
        }
      } else {
        // Mensagem de texto padrão
        const messageContentContainer = document.createElement('div');
        messageContentContainer.className = 'message-content-container';
        const senderText = sender === userName ? 'Você' : sender;
        messageElement.innerHTML = `
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="message ${sender === userName ? 'own' : 'other'}">
            <strong class="sender">${senderText}:</strong> ${message}
          </div>
        `;
        messageElement.appendChild(messageContentContainer);
      }
    }
  }

  messageContainer.appendChild(messageElement);
  chatWindow.appendChild(messageContainer);
  scrollToBottom();
}

function createEmbeddedContent(dataURL) {
  if (dataURL.startsWith('data:image')) {
    // Imagem embutida
    const imageElement = document.createElement('img');
    imageElement.src = dataURL;
    imageElement.alt = 'Imagem incorporada';
    imageElement.classList.add('thumbnail');
    return imageElement;
  } else if (dataURL.startsWith('data:audio')) {
    // Áudio embutido
    const audioElement = document.createElement('audio');
    audioElement.controls = true;
    const sourceElement = document.createElement('source');
    sourceElement.src = dataURL;
    audioElement.appendChild(sourceElement);
    return audioElement;
  } else if (dataURL.startsWith('data:video')) {
    // Vídeo embutido
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    const sourceElement = document.createElement('source');
    sourceElement.src = dataURL;
    videoElement.appendChild(sourceElement);
    videoElement.classList.add('thumbnail');
    return videoElement;
  } else {
    // Outros tipos de arquivos não suportados como conteúdo embutido
    return null;
  }
}


function updateMessageHistory(oldName, newName) {
  for (const message of messageHistory) {
    if (message.sender === oldName) {
      message.sender = newName;
      const messageContainer = document.querySelector(`.message-container[data-key="${message.messageType}"]`);
      if (messageContainer) {
        const messageElement = messageContainer.querySelector('.message');
        if (messageElement) {
          messageElement.textContent = newName === userName ? 'Você' : newName;
        }
      }
    }
  }
}

// Função para consultar todas as mensagens associadas a um nome de usuário no banco de dados
async function consultarMensagensDoUsuario(userName) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/mensagens/${userName}`);
    const data = await response.json();

    // Limpar o chat antes de exibir as mensagens recuperadas
    chatWindow.innerHTML = '';

    // Exibir as mensagens recuperadas no chat
    data.forEach((row) => {
      // Aqui está a chamada à função appendMessage para exibir as mensagens recuperadas
      if (row.sender === userName) {
        appendMessage(row.sender, row.message, 'own');
      }
      // else {
      //   appendMessage(row.sender, row.message, 'other');
      // }
    });
  } catch (error) {
    console.error('Erro ao consultar mensagens do usuário:', error);
  }
}




function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
  chatWindow.scrollTo = chatWindow.style.scrollBehavior = 'smooth';
}


// Evento de envio do formulário
document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('file-input');
  const messageInput = document.getElementById('message-input');

  // Obtenha o valor do campo de mensagem
  const message = messageInput.value.trim();

  // Se a mensagem ou o arquivo não estiverem vazios, envie a mensagem
  if (message || fileInput.files.length > 0) {
    enviarMensagem(userName ,message);
  }

  // Limpe o campo de mensagem e o campo de arquivo
  messageInput.value = '';
  fileInput.value = '';
});


sendButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      // Enviar o conteúdo do arquivo para o servidor via WebSocket
      socket.send(fileContent);
    };

    reader.readAsArrayBuffer(file);
  }
});

// Supondo que você tenha o arquivo selecionado em um input de arquivo (input[type="file"])

// Dentro do evento de mudança do input de arquivo (fileInput.addEventListener('change', ...))
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const fileContent = event.target.result;

    // Enviar a imagem como mensagem para exibir no chat
    enviarMensagem(userName, fileContent);


  };

  reader.readAsDataURL(file);
});

const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');

// Evento de clique para abrir o modal e exibir a imagem
chatWindow.addEventListener('click', (event) => {
  if (event.target.classList.contains('thumbnail')) {
    modal.style.display = 'block';
    modalImage.src = event.target.src;
  }
});

// Evento de clique para fechar o modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Evento de clique fora do modal para fechá-lo
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
