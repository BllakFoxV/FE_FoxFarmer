export const ActionType = {
    TAP: "tap",
    HOLD_POINT: "hold_point",
    SWIPE: "swipe",
    INPUT_TEXT: "input_text",
    SEND_KEY: "send_key",
    GOTO: "goto",
    IF_VAR: "if_var",
    ADD_LOG: "add_log",
    CLICK_IMAGE: "click_image",
    FIND_IMAGE: "find_image",
    OCR_TEXT: "ocr",
    OPEN_APP: "open_app",
    STOP_APP: "stop_app",
    CHECK_ACTIVE_APP: "check_app",
    GROUP_START: "group_start",
    GROUP_END: "group_end"
};

export const ACTION_MANIFEST = {
    [ActionType.TAP]: {
        label: "Tap Point",
        fields: [
            { key: 'x', type: 'number', label: 'X' },
            { key: 'y', type: 'number', label: 'Y' },
            { key: 'delay', type: 'number', label: 'Delay (ms)', default: 200 }
        ]
    },
    [ActionType.HOLD_POINT]: {
        label: "Long Press",
        fields: [
            { key: 'x', type: 'number', label: 'X' },
            { key: 'y', type: 'number', label: 'Y' },
            { key: 'duration', type: 'number', label: 'Duration (ms)', default: 1000 }
        ]
    },
    [ActionType.SWIPE]: {
        label: "Swipe/Drag",
        fields: [
            { key: 'x1', type: 'number', label: 'Start X' },
            { key: 'y1', type: 'number', label: 'Start Y' },
            { key: 'x2', type: 'number', label: 'End X' },
            { key: 'y2', type: 'number', label: 'End Y' },
            { key: 'duration', type: 'number', label: 'Speed (ms)', default: 300 }
        ]
    },
    [ActionType.INPUT_TEXT]: {
        label: "Input Text",
        fields: [
            { key: 'text', type: 'text', label: 'Content' },
            { key: 'clear', type: 'toggle', label: 'Clear before type', default: false }
        ]
    },
    [ActionType.SEND_KEY]: {
        label: "Send Key Event",
        fields: [
            { key: 'key_code', type: 'select', options: ['HOME', 'BACK', 'ENTER', 'RECENT', 'POWER', 'VOLUME_UP', 'VOLUME_DOWN'] }
        ]
    },
    [ActionType.GOTO]: {
        label: "Jump to Step",
        fields: [
            { key: 'target_id', type: 'link', label: 'Target Action' }
        ]
    },
    [ActionType.IF_VAR]: {
        label: "Condition (If)",
        fields: [
            { key: 'var_name', type: 'text', label: 'Variable Name' },
            { key: 'operator', type: 'select', options: ['==', '!=', '>', '<', 'contains'] },
            { key: 'value', type: 'text', label: 'Expected Value' },
            { key: 'true_id', type: 'link', label: 'If True' },
            { key: 'false_id', type: 'link', label: 'If False' }
        ]
    },
    [ActionType.ADD_LOG]: {
        label: "Write Log",
        fields: [
            { key: 'message', type: 'text', label: 'Log Message' },
            { key: 'level', type: 'select', options: ['INFO', 'WARNING', 'ERROR'], default: 'INFO' }
        ]
    },
    [ActionType.CLICK_IMAGE]: {
        label: "Visual Click",
        fields: [
            { key: 'region', type: 'picker', label: 'Search Area' },
            { key: 'threshold', type: 'number', label: 'Confidence', default: 0.8 },
            { key: 'template', type: 'hidden' }
        ]
    },
    [ActionType.FIND_IMAGE]: {
        label: "Check Image Exist",
        fields: [
            { key: 'var_name', type: 'text', label: 'Save Result To' },
            { key: 'region', type: 'picker', label: 'Search Area' },
            { key: 'template', type: 'hidden' }
        ]
    },
    [ActionType.OCR_TEXT]: {
        label: "Extract Text (OCR)",
        fields: [
            { key: 'var_name', type: 'text', label: 'Save Text To' },
            { key: 'region', type: 'picker', label: 'OCR Area' },
            { key: 'regex', type: 'text', label: 'Filter (Regex)' }
        ]
    },
    [ActionType.OPEN_APP]: {
        label: "Launch App",
        fields: [
            { key: 'package_name', type: 'text', label: 'Package ID' }
        ]
    },
    [ActionType.STOP_APP]: {
        label: "Force Stop App",
        fields: [
            { key: 'package_name', type: 'text', label: 'Package ID' }
        ]
    },
    [ActionType.CHECK_ACTIVE_APP]: {
        label: "Check Current App",
        fields: [
            { key: 'package_name', type: 'text', label: 'Expected Package' },
            { key: 'var_name', type: 'text', label: 'Save Result (Boolean)' }
        ]
    },
    [ActionType.GROUP_START]: {
        label: "Group Header",
        fields: [
            { key: 'label', type: 'text', label: 'Folder Name' }
        ]
    },
    [ActionType.GROUP_END]: {
        label: "Group Footer",
        fields: []
    }
};