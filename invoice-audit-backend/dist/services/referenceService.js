"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchReferenceDrugsService = void 0;
const axios_1 = __importDefault(require("axios"));
const MOCK_API_URL = 'https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs';
const fetchReferenceDrugsService = async () => {
    try {
        const response = await axios_1.default.get(MOCK_API_URL);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching reference drugs:', error);
        throw new Error('Failed to fetch reference drugs');
    }
};
exports.fetchReferenceDrugsService = fetchReferenceDrugsService;
