import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell, Cloud, CloudOff, Globe, LogOut, Mail, Moon, Paperclip, Pin, Plus,
  Search, Share2, Sun, Trash2, UserPlus, LockKeyhole, LogIn, X,
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TOKEN_KEY = 'easynote_access_token';
const REFRESH_TOKEN_KEY = 'easynote_refresh_token';
const USER_ID_KEY = 'easynote_user_id';
const USER_EMAIL_KEY = 'easynote_user_email';
const LANG_KEY = 'easynote_lang';
const THEME_KEY = 'easynote_darkmode';

const STORAGE_BUCKET = 'note-attachments';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const COLORS = [
  { name: 'yellow', hex: '#FFF9C4', rgb: '250, 204, 21' },
  { name: 'red', hex: '#FFCDD2', rgb: '251, 113, 133' },
  { name: 'blue', hex: '#BBDEFB', rgb: '56, 189, 248' },
  { name: 'green', hex: '#C8E6C9', rgb: '52, 211, 153' },
  { name: 'purple', hex: '#E1BEE7', rgb: '192, 132, 252' },
  { name: 'orange', hex: '#FFE0B2', rgb: '251, 146, 60' },
];

const translations = {
  en: {
    appName: 'EasyNote Free: Color Notepad',
    subtitle: 'Simple notes. Bright ideas. Synced to the cloud.',
    signIn: 'Sign In', signUp: 'Create Account', signInTitle: 'Welcome back',
    signUpTitle: 'Create your account',
    signInDescription: 'Sign in to access your notes from the cloud.',
    signUpDescription: 'Create a free account and keep your notes synchronized.',
    email: 'Email', emailPlaceholder: 'you@example.com', password: 'Password',
    passwordPlaceholder: 'Your password', noAccount: 'No account yet?',
    haveAccount: 'Already have an account?', createAccount: 'Register',
    login: 'Sign In', logout: 'Log Out', signingIn: 'Signing in...',
    registering: 'Creating account...',
    checkEmail: 'Account created. Check your email to confirm your account, then sign in.',
    authError: 'Authentication error.', networkError: 'Network error. Please try again.',
    continueWithGoogle: 'Continue with Google', orContinueWith: 'or continue with',
    forgotPassword: 'Forgot password?', resetTitle: 'Reset your password',
    resetDescription: 'Enter your email and we will send you a recovery link.',
    sendReset: 'Send recovery link', sendingReset: 'Sending...',
    resetSent: 'Recovery email sent. Open the link in the email to choose a new password.',
    newPasswordTitle: 'Choose a new password',
    newPasswordDescription: 'Enter a new password for your EasyNote account.',
    newPassword: 'New password', updatePassword: 'Save new password',
    updatingPassword: 'Saving...', passwordUpdated: 'Password updated. You can now sign in.',
    backToSignIn: 'Back to Sign In', search: 'Search notes...', newNote: 'New Note',
    title: 'Title', titlePlaceholder: 'Note title', text: 'Note',
    textPlaceholder: 'Write something...', reminder: 'Reminder', alarmTitle: 'Alarm', stopAlarm: 'Stop', snoozeAlarm: 'Snooze 5 min', attachment: 'Attachment',
    addAttachment: 'Attach JPG / PNG', replaceAttachment: 'Replace image',
    removeAttachment: 'Remove image', fileTooLarge: 'Image must be 5 MB or smaller.',
    wrongFileType: 'Only JPG, JPEG and PNG images are allowed.',
    uploadFailed: 'Image upload failed.', color: 'Color', save: 'Save Note',
    saving: 'Saving...', editNote: 'Edit Note', saveChanges: 'Save Changes', cancel: 'Cancel',
    pinned: 'Pinned', notes: 'Notes', empty: 'No notes yet', emptySearch: 'Nothing found',
    delete: 'Delete', pin: 'Pin', unpin: 'Unpin', created: 'Created',
    reminderLabel: 'Reminder', attachmentLabel: 'Attachment', language: 'Language',
    lightMode: 'Light mode', darkMode: 'Dark mode', syncing: 'Syncing...',
    synced: 'Cloud synced', offline: 'Sync error', loading: 'Loading notes...',
    colors: { yellow: 'Yellow', red: 'Red', blue: 'Blue', green: 'Green', purple: 'Purple', orange: 'Orange' },
  },
  ru: {
    appName: 'EasyNote Free: Color Notepad',
    subtitle: 'Простые заметки. Яркие идеи. Синхронизация в облаке.',
    signIn: 'Вход', signUp: 'Регистрация', signInTitle: 'С возвращением',
    signUpTitle: 'Создайте аккаунт',
    signInDescription: 'Войдите, чтобы получить доступ к заметкам из облака.',
    signUpDescription: 'Создайте бесплатный аккаунт и синхронизируйте свои заметки.',
    email: 'Email', emailPlaceholder: 'you@example.com', password: 'Пароль',
    passwordPlaceholder: 'Ваш пароль', noAccount: 'Ещё нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?', createAccount: 'Зарегистрироваться',
    login: 'Войти', logout: 'Выйти', signingIn: 'Входим...', registering: 'Создаём аккаунт...',
    checkEmail: 'Аккаунт создан. Проверьте почту, подтвердите email, затем войдите.',
    authError: 'Ошибка авторизации.', networkError: 'Ошибка сети. Попробуйте ещё раз.',
    continueWithGoogle: 'Продолжить с Google', orContinueWith: 'или продолжить через',
    forgotPassword: 'Забыли пароль?', resetTitle: 'Восстановление пароля',
    resetDescription: 'Введите email, и мы отправим ссылку для восстановления пароля.',
    sendReset: 'Отправить ссылку', sendingReset: 'Отправляем...',
    resetSent: 'Письмо отправлено. Откройте ссылку в письме и задайте новый пароль.',
    newPasswordTitle: 'Новый пароль',
    newPasswordDescription: 'Введите новый пароль для вашего аккаунта EasyNote.',
    newPassword: 'Новый пароль', updatePassword: 'Сохранить новый пароль',
    updatingPassword: 'Сохраняем...', passwordUpdated: 'Пароль изменён. Теперь можно войти.',
    backToSignIn: 'Вернуться ко входу', search: 'Поиск заметок...', newNote: 'Новая заметка',
    title: 'Заголовок', titlePlaceholder: 'Название заметки', text: 'Текст заметки',
    textPlaceholder: 'Напишите что-нибудь...', reminder: 'Напоминание', alarmTitle: 'Будильник', stopAlarm: 'Остановить', snoozeAlarm: 'Отложить на 5 минут', enableNotifications: 'Включить уведомления', notificationsEnabled: 'Уведомления включены', notificationsUnsupported: 'Этот браузер не поддерживает уведомления.', attachment: 'Вложение',
    addAttachment: 'Прикрепить JPG / PNG', replaceAttachment: 'Заменить изображение',
    removeAttachment: 'Убрать изображение', fileTooLarge: 'Размер изображения — не больше 5 MB.',
    wrongFileType: 'Можно загружать только JPG, JPEG и PNG.',
    uploadFailed: 'Не удалось загрузить изображение.', color: 'Цвет',
    save: 'Сохранить заметку', saving: 'Сохраняем...', editNote: 'Редактировать заметку',
    saveChanges: 'Сохранить изменения', cancel: 'Отмена', pinned: 'Закреплённые',
    notes: 'Заметки', empty: 'Заметок пока нет', emptySearch: 'Ничего не найдено',
    delete: 'Удалить', pin: 'Закрепить', unpin: 'Открепить', created: 'Создано',
    reminderLabel: 'Напоминание', attachmentLabel: 'Вложение', language: 'Язык',
    lightMode: 'Светлая тема', darkMode: 'Тёмная тема', syncing: 'Синхронизация...',
    synced: 'Синхронизировано', offline: 'Ошибка синхронизации', loading: 'Загружаем заметки...',
    colors: { yellow: 'Жёлтый', red: 'Красный', blue: 'Синий', green: 'Зелёный', purple: 'Фиолетовый', orange: 'Оранжевый' },
  },
  es: {
    appName: 'EasyNote Free: Color Notepad',
    subtitle: 'Notas simples. Ideas brillantes. Sincronizadas en la nube.',
    signIn: 'Entrar', signUp: 'Registro', signInTitle: 'Bienvenido de nuevo',
    signUpTitle: 'Crea tu cuenta',
    signInDescription: 'Inicia sesión para acceder a tus notas desde la nube.',
    signUpDescription: 'Crea una cuenta gratuita y sincroniza tus notas.',
    email: 'Email', emailPlaceholder: 'you@example.com', password: 'Contraseña',
    passwordPlaceholder: 'Tu contraseña', noAccount: '¿No tienes cuenta?',
    haveAccount: '¿Ya tienes una cuenta?', createAccount: 'Registrarse',
    login: 'Entrar', logout: 'Salir', signingIn: 'Entrando...', registering: 'Creando cuenta...',
    checkEmail: 'Cuenta creada. Revisa tu correo, confirma tu email y después inicia sesión.',
    authError: 'Error de autenticación.', networkError: 'Error de red. Inténtalo de nuevo.',
    continueWithGoogle: 'Continuar con Google', orContinueWith: 'o continuar con',
    forgotPassword: '¿Olvidaste tu contraseña?', resetTitle: 'Restablecer contraseña',
    resetDescription: 'Introduce tu email y te enviaremos un enlace de recuperación.',
    sendReset: 'Enviar enlace', sendingReset: 'Enviando...',
    resetSent: 'Correo enviado. Abre el enlace del email para elegir una nueva contraseña.',
    newPasswordTitle: 'Nueva contraseña',
    newPasswordDescription: 'Introduce una nueva contraseña para tu cuenta de EasyNote.',
    newPassword: 'Nueva contraseña', updatePassword: 'Guardar nueva contraseña',
    updatingPassword: 'Guardando...', passwordUpdated: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    backToSignIn: 'Volver a iniciar sesión', search: 'Buscar notas...', newNote: 'Nueva nota',
    title: 'Título', titlePlaceholder: 'Título de la nota', text: 'Nota',
    textPlaceholder: 'Escribe algo...', reminder: 'Recordatorio', alarmTitle: 'Alarma', stopAlarm: 'Detener', snoozeAlarm: 'Posponer 5 min', enableNotifications: 'Activar notificaciones', notificationsEnabled: 'Notificaciones activadas', notificationsUnsupported: 'Este navegador no admite notificaciones.', attachment: 'Archivo adjunto',
    addAttachment: 'Adjuntar JPG / PNG', replaceAttachment: 'Reemplazar imagen',
    removeAttachment: 'Quitar imagen', fileTooLarge: 'La imagen debe pesar 5 MB o menos.',
    wrongFileType: 'Solo se permiten imágenes JPG, JPEG y PNG.',
    uploadFailed: 'No se pudo subir la imagen.', color: 'Color', save: 'Guardar nota',
    saving: 'Guardando...', editNote: 'Editar nota', saveChanges: 'Guardar cambios',
    cancel: 'Cancelar', pinned: 'Fijadas', notes: 'Notas', empty: 'Todavía no hay notas',
    emptySearch: 'No se encontró nada', delete: 'Eliminar', pin: 'Fijar', unpin: 'Desfijar',
    created: 'Creado', reminderLabel: 'Recordatorio', attachmentLabel: 'Archivo',
    language: 'Idioma', lightMode: 'Tema claro', darkMode: 'Tema oscuro',
    syncing: 'Sincronizando...', synced: 'Sincronizado', offline: 'Error de sincronización',
    loading: 'Cargando notas...',
    colors: { yellow: 'Amarillo', red: 'Rojo', blue: 'Azul', green: 'Verde', purple: 'Morado', orange: 'Naranja' },
  },
};

function loadLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  return ['en', 'ru', 'es'].includes(saved) ? saved : 'en';
}
function loadDarkMode() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === null ? true : saved === 'true';
}
function getStoredSession() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY) || '',
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',
    userId: localStorage.getItem(USER_ID_KEY) || '',
    email: localStorage.getItem(USER_EMAIL_KEY) || '',
  };
}
function saveSession(data) {
  if (!data?.access_token || !data?.user?.id) return false;
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token || '');
  localStorage.setItem(USER_ID_KEY, data.user.id);
  localStorage.setItem(USER_EMAIL_KEY, data.user.email || '');
  return true;
}
function clearSession() {
  [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, USER_EMAIL_KEY].forEach((k) => localStorage.removeItem(k));
}

async function signInRequest(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Sign in failed');
  return data;
}
async function signUpRequest(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Registration failed');
  return data;
}
function startGoogleSignIn() {
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams({ provider: 'google', redirect_to: redirectTo });
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;
}
async function getOAuthSessionFromUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = hash.get('access_token') || '';
  const refreshToken = hash.get('refresh_token') || '';
  if (!accessToken || !refreshToken) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
  });
  const user = await response.json().catch(() => null);
  if (!response.ok || !user?.id) throw new Error(user?.message || 'Google sign in failed');
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  return { access_token: accessToken, refresh_token: refreshToken, user };
}
async function refreshSession() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.access_token) { clearSession(); return false; }
  return saveSession(data);
}
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY) || '';
  let response = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (response.status !== 401) return response;
  if (!(await refreshSession())) return response;
  const nextToken = localStorage.getItem(TOKEN_KEY) || '';
  return fetch(url, { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${nextToken}` } });
}
async function sendPasswordResetRequest(email) {
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Unable to send recovery email');
}
async function updatePasswordRequest(accessToken, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || 'Unable to update password');
}
function getRecoveryTokenFromUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return hash.get('type') === 'recovery' ? hash.get('access_token') || '' : '';
}
function getDatabaseHeaders(accessToken, extra = {}) {
  return { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...extra };
}

async function fetchNotes(accessToken, userId) {
  const params = new URLSearchParams({ select: '*', user_id: `eq.${userId}`, order: 'created_at.desc' });
  const response = await authenticatedFetch(`${SUPABASE_URL}/rest/v1/notes?${params}`, {
    headers: getDatabaseHeaders(accessToken),
  });
  if (!response.ok) throw new Error((await response.text()) || 'Unable to load notes');
  return response.json();
}
async function createNoteRequest(accessToken, userId, note) {
  const response = await authenticatedFetch(`${SUPABASE_URL}/rest/v1/notes`, {
    method: 'POST',
    headers: getDatabaseHeaders(accessToken, { Prefer: 'return=representation' }),
    body: JSON.stringify({ user_id: userId, ...note }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.details || 'Unable to create note');
  return Array.isArray(data) ? data[0] : data;
}
async function updatePinRequest(accessToken, userId, noteId, pinned) {
  const params = new URLSearchParams({ id: `eq.${noteId}`, user_id: `eq.${userId}` });
  const response = await authenticatedFetch(`${SUPABASE_URL}/rest/v1/notes?${params}`, {
    method: 'PATCH', headers: getDatabaseHeaders(accessToken, { Prefer: 'return=representation' }),
    body: JSON.stringify({ pinned }),
  });
  if (!response.ok) throw new Error('Unable to update note');
}
async function updateNoteRequest(accessToken, userId, noteId, note) {
  const params = new URLSearchParams({ id: `eq.${noteId}`, user_id: `eq.${userId}` });
  const response = await authenticatedFetch(`${SUPABASE_URL}/rest/v1/notes?${params}`, {
    method: 'PATCH', headers: getDatabaseHeaders(accessToken, { Prefer: 'return=representation' }),
    body: JSON.stringify(note),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.details || 'Unable to update note');
  return Array.isArray(data) ? data[0] : data;
}
async function deleteNoteRequest(accessToken, userId, noteId) {
  const params = new URLSearchParams({ id: `eq.${noteId}`, user_id: `eq.${userId}` });
  const response = await authenticatedFetch(`${SUPABASE_URL}/rest/v1/notes?${params}`, {
    method: 'DELETE', headers: getDatabaseHeaders(accessToken),
  });
  if (!response.ok) throw new Error((await response.text()) || 'Unable to delete note');
}

/* STORAGE */
function safeFileName(name) {
  const extension = name.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
  return `${crypto.randomUUID()}${extension}`;
}
async function uploadAttachment(userId, file) {
  const path = `${userId}/${safeFileName(file.name)}`;
  const response = await authenticatedFetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodeURIComponent(path).replace(/%2F/g, '/')}`,
    {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': file.type, 'x-upsert': 'false' },
      body: file,
    }
  );
  if (!response.ok) throw new Error((await response.text()) || 'Image upload failed');
  return path;
}
async function deleteAttachmentRequest(path) {
  if (!path || path === 'image_1.png') return;
  const encodedPath = encodeURIComponent(path).replace(/%2F/g, '/');
  const response = await authenticatedFetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodedPath}`,
    { method: 'DELETE', headers: { apikey: SUPABASE_ANON_KEY } }
  );
  if (!response.ok && response.status !== 404) {
    throw new Error((await response.text()) || 'Unable to delete attachment');
  }
}
async function createAttachmentSignedUrl(path) {
  if (!path || path === 'image_1.png') return '';
  const response = await authenticatedFetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${STORAGE_BUCKET}/${encodeURIComponent(path).replace(/%2F/g, '/')}`,
    {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn: 3600 }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.signedURL) return '';
  return data.signedURL.startsWith('http') ? data.signedURL : `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}
async function addAttachmentUrls(notes) {
  return Promise.all((notes || []).map(async (note) => ({
    ...note,
    attachment_url: note.attachment ? await createAttachmentSignedUrl(note.attachment) : '',
  })));
}

function getLocale(language) { return language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US'; }
function localDateTimeToIso(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return value;

  const [, year, month, day, hour, minute] = match;
  const local = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
    0
  );

  return local.toISOString();
}

function isoToLocalDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (number) => String(number).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(value, language) {
  if (!value) return '';
  return new Intl.DateTimeFormat(getLocale(language), { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
function formatReminder(value, language) {
  if (!value) return '';
  return new Intl.DateTimeFormat(getLocale(language), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default function App() {
  const storedSession = getStoredSession();
  const [language, setLanguage] = useState(loadLanguage);
  const [isDarkMode, setIsDarkMode] = useState(loadDarkMode);
  const [accessToken, setAccessToken] = useState(storedSession.accessToken);
  const [userId, setUserId] = useState(storedSession.userId);
  const [userEmail, setUserEmail] = useState(storedSession.email);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [syncState, setSyncState] = useState('synced');
  const [sessionReady, setSessionReady] = useState(false);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState('');
  const [attachmentError, setAttachmentError] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [snoozedAlarms, setSnoozedAlarms] = useState({});
  const [snoozeUntil, setSnoozeUntil] = useState(null);
  const [snoozeSecondsLeft, setSnoozeSecondsLeft] = useState(0);
  const alarmIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const t = translations[language];
  const isLoggedIn = Boolean(accessToken && userId);

  useEffect(() => localStorage.setItem(LANG_KEY, language), [language]);
  useEffect(() => localStorage.setItem(THEME_KEY, String(isDarkMode)), [isDarkMode]);
  useEffect(() => () => { if (attachmentPreview?.startsWith('blob:')) URL.revokeObjectURL(attachmentPreview); }, [attachmentPreview]);

  function playAlarmBeep() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioContextClass();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.error('Unable to play alarm sound:', error);
    }
  }

  function stopAlarm() {
    if (alarmIntervalRef.current) {
      window.clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setSnoozeUntil(null);
    setSnoozeSecondsLeft(0);
    setActiveAlarm(null);
  }

  function startAlarm(note) {
    if (activeAlarm?.id === note.id && alarmIntervalRef.current) return;
    if (alarmIntervalRef.current) window.clearInterval(alarmIntervalRef.current);
    setSnoozeUntil(null);
    setSnoozeSecondsLeft(0);
    setActiveAlarm(note);
    playAlarmBeep();
    alarmIntervalRef.current = window.setInterval(playAlarmBeep, 1200);
  }

  function snoozeAlarm() {
    if (!activeAlarm) return;
    const noteId = activeAlarm.id;
    const until = Date.now() + 5 * 60 * 1000;
    if (alarmIntervalRef.current) {
      window.clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setSnoozeUntil(until);
    setSnoozeSecondsLeft(5 * 60);
    setSnoozedAlarms((current) => ({
      ...current,
      [noteId]: until,
    }));
  }

  useEffect(() => {
    if (!snoozeUntil || !activeAlarm) return;
    const updateCountdown = () => {
      const seconds = Math.max(0, Math.ceil((snoozeUntil - Date.now()) / 1000));
      setSnoozeSecondsLeft(seconds);
      if (seconds <= 0) setSnoozeUntil(null);
    };
    updateCountdown();
    const countdownTimer = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(countdownTimer);
  }, [snoozeUntil, activeAlarm]);

  useEffect(() => () => {
    if (alarmIntervalRef.current) window.clearInterval(alarmIntervalRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn || notificationPermission !== 'granted' || typeof Notification === 'undefined') return;

    function checkReminders() {
      const now = Date.now();
      notes.forEach((note) => {
        if (!note.reminder) return;
        const originalReminderTime = new Date(note.reminder).getTime();
        const snoozedUntil = snoozedAlarms[note.id];
        const reminderTime = snoozedUntil || originalReminderTime;
        if (!Number.isFinite(reminderTime) || reminderTime > now) return;

        // Do not make very old reminders ring when the app is opened later.
        if (!snoozedUntil && now - reminderTime > 2 * 60 * 1000) return;

        const notificationKey = snoozedUntil
          ? `easynote_snooze_notification_${note.id}_${snoozedUntil}`
          : `easynote_notification_${note.id}_${note.reminder}`;
        const alarmKey = snoozedUntil
          ? `easynote_snooze_alarm_${note.id}_${snoozedUntil}`
          : `easynote_alarm_${note.id}_${note.reminder}`;

        if (!localStorage.getItem(alarmKey)) {
          startAlarm(note);
          localStorage.setItem(alarmKey, 'shown');
        }

        if (!localStorage.getItem(notificationKey)) {
          try {
            new Notification(note.title || t.appName, {
              body: note.content?.trim() || `${t.reminderLabel}: ${formatReminder(note.reminder, language)}`,
              tag: notificationKey,
              requireInteraction: true,
            });
          } catch (error) {
            console.error('Unable to show reminder notification:', error);
          }
          localStorage.setItem(notificationKey, 'shown');
        }

        if (snoozedUntil) {
          setSnoozedAlarms((current) => {
            const next = { ...current };
            delete next[note.id];
            return next;
          });
        }
      });
    }

    checkReminders();
    const timer = window.setInterval(checkReminders, 15000);
    return () => window.clearInterval(timer);
  }, [notes, isLoggedIn, notificationPermission, language, t.appName, t.reminderLabel, snoozedAlarms]);

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      const oauthSession = await getOAuthSessionFromUrl();
      if (oauthSession) {
        saveSession(oauthSession);
        if (!cancelled) {
          setAccessToken(oauthSession.access_token); setUserId(oauthSession.user.id);
          setUserEmail(oauthSession.user.email || ''); setSessionReady(true);
        }
        return;
      }
      const current = getStoredSession();
      if (!current.refreshToken) { if (!cancelled) setSessionReady(true); return; }
      const refreshed = await refreshSession();
      if (cancelled) return;
      if (refreshed) {
        const next = getStoredSession();
        setAccessToken(next.accessToken); setUserId(next.userId); setUserEmail(next.email);
      } else {
        setAccessToken(''); setUserId(''); setUserEmail(''); setNotes([]);
      }
      setSessionReady(true);
    }
    restoreSession().catch((error) => { console.error(error); if (!cancelled) setSessionReady(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    if (!isLoggedIn) { setNotes([]); return; }
    let cancelled = false;
    async function loadCloudNotes() {
      setLoadingNotes(true); setSyncState('syncing');
      try {
        const data = await fetchNotes(accessToken, userId);
        const enriched = await addAttachmentUrls(data);
        if (!cancelled) { setNotes(enriched); setSyncState('synced'); }
      } catch (error) {
        console.error(error); if (!cancelled) setSyncState('error');
      } finally { if (!cancelled) setLoadingNotes(false); }
    }
    loadCloudNotes();
    return () => { cancelled = true; };
  }, [accessToken, userId, isLoggedIn, sessionReady]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...notes].filter((note) => !query ||
      String(note.title || '').toLowerCase().includes(query) ||
      String(note.content || '').toLowerCase().includes(query))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [notes, search]);
  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const normalNotes = filteredNotes.filter((n) => !n.pinned);

  function toDateTimeLocal(value) {
    if (!value) return '';
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  async function enableNotifications() {
    if (typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error('Unable to request notification permission:', error);
    }
  }

  function clearForm() {
    setEditingNoteId(null); setNewTitle(''); setNewContent(''); setReminderDate('');
    setAttachmentFile(null); setExistingAttachment(''); setAttachmentPreview('');
    setAttachmentError(''); setSelectedColor(COLORS[0]);
  }
  function startEditing(note) {
    setEditingNoteId(note.id); setNewTitle(note.title || ''); setNewContent(note.content || '');
    setReminderDate(toDateTimeLocal(note.reminder)); setAttachmentFile(null);
    setExistingAttachment(note.attachment || ''); setAttachmentPreview(note.attachment_url || '');
    setAttachmentError('');
    setSelectedColor(COLORS.find((c) => c.name === note.color_name) || COLORS[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function chooseAttachment(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) { setAttachmentError(t.wrongFileType); return; }
    if (file.size > MAX_FILE_SIZE) { setAttachmentError(t.fileTooLarge); return; }
    setAttachmentError('');
    setAttachmentFile(file);
    setExistingAttachment('');
    setAttachmentPreview(URL.createObjectURL(file));
  }
  function removeAttachment() {
    setAttachmentFile(null); setExistingAttachment(''); setAttachmentPreview(''); setAttachmentError('');
  }
  async function resolveAttachment() {
    if (attachmentFile) return uploadAttachment(userId, attachmentFile);
    return existingAttachment || null;
  }
  async function saveEditedNote() {
    if (!editingNoteId || savingNote || (!newTitle.trim() && !newContent.trim())) return;
    setSavingNote(true); setSyncState('syncing'); setAttachmentError('');
    try {
      const previousNote = notes.find((item) => item.id === editingNoteId);
      const previousAttachment = previousNote?.attachment || '';
      const attachment = await resolveAttachment();
      const updated = await updateNoteRequest(accessToken, userId, editingNoteId, {
        title: newTitle.trim(), content: newContent.trim(), color: selectedColor.hex,
        color_name: selectedColor.name, reminder: localDateTimeToIso(reminderDate), attachment,
      });
      if (previousAttachment && previousAttachment !== attachment) {
        try { await deleteAttachmentRequest(previousAttachment); }
        catch (storageError) { console.error('Unable to delete old attachment:', storageError); }
      }
      const [enriched] = await addAttachmentUrls([updated]);
      setNotes((current) => current.map((item) => item.id === editingNoteId ? enriched : item));
      clearForm(); setSyncState('synced');
    } catch (error) {
      console.error(error); setAttachmentError(error?.message || t.uploadFailed); setSyncState('error');
    } finally { setSavingNote(false); }
  }
  async function addNote() {
    if ((!newTitle.trim() && !newContent.trim()) || !isLoggedIn || savingNote) return;
    setSavingNote(true); setSyncState('syncing'); setAttachmentError('');
    try {
      const attachment = await resolveAttachment();
      const created = await createNoteRequest(accessToken, userId, {
        title: newTitle.trim(), content: newContent.trim(), color: selectedColor.hex,
        color_name: selectedColor.name, pinned: false, reminder: localDateTimeToIso(reminderDate), attachment,
      });
      const [enriched] = await addAttachmentUrls([created]);
      setNotes((current) => [enriched, ...current]); clearForm(); setSyncState('synced');
    } catch (error) {
      console.error(error); setAttachmentError(error?.message || t.uploadFailed); setSyncState('error');
    } finally { setSavingNote(false); }
  }
  async function togglePin(note) {
    const next = !note.pinned;
    setNotes((current) => current.map((i) => i.id === note.id ? { ...i, pinned: next } : i));
    setSyncState('syncing');
    try { await updatePinRequest(accessToken, userId, note.id, next); setSyncState('synced'); }
    catch (error) {
      console.error(error);
      setNotes((current) => current.map((i) => i.id === note.id ? { ...i, pinned: note.pinned } : i));
      setSyncState('error');
    }
  }
  async function deleteNote(note) {
    const old = notes; setNotes((current) => current.filter((i) => i.id !== note.id)); setSyncState('syncing');
    try {
      await deleteNoteRequest(accessToken, userId, note.id);
      if (note.attachment) {
        try { await deleteAttachmentRequest(note.attachment); }
        catch (storageError) { console.error('Unable to delete attachment:', storageError); }
      }
      setSyncState('synced');
    }
    catch (error) { console.error(error); setNotes(old); setSyncState('error'); }
  }
  async function shareNote(note) {
    const text = [note.title, note.content].filter(Boolean).join('\n\n');
    try {
      if (navigator.share) { await navigator.share({ title: note.title || 'EasyNote', text: text || 'EasyNote' }); return; }
      await navigator.clipboard.writeText(text || 'EasyNote'); alert('Note copied to clipboard!');
    } catch (error) { if (error?.name !== 'AbortError') console.error(error); }
  }
  function logOut() {
    clearSession(); setAccessToken(''); setUserId(''); setUserEmail(''); setNotes([]); setSearch(''); clearForm();
  }

  if (!isLoggedIn) {
    return <AuthScreen language={language} setLanguage={setLanguage} isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode} onLoggedIn={(data) => {
        saveSession(data); setAccessToken(data.access_token); setUserId(data.user.id); setUserEmail(data.user.email || '');
      }} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${isDarkMode ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">{t.appName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</p>
              <SyncBadge state={syncState} isDarkMode={isDarkMode} t={t} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`hidden max-w-[200px] truncate rounded-xl border px-3 py-2 text-xs sm:block ${isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>{userEmail}</div>
            <div className={`flex items-center rounded-xl border px-2 ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <Globe size={16} className={isDarkMode ? 'text-cyan-300' : 'text-cyan-600'} />
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`cursor-pointer bg-transparent px-2 py-2 text-sm font-semibold outline-none ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                <option value="en" className="text-slate-900">EN</option><option value="ru" className="text-slate-900">RU</option><option value="es" className="text-slate-900">ES</option>
              </select>
            </div>
            <button type="button" onClick={() => setIsDarkMode((v) => !v)} title={isDarkMode ? t.lightMode : t.darkMode}
              className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-900 text-yellow-300' : 'border-slate-200 bg-white text-slate-700'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" onClick={logOut} className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold ${isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
              <LogOut size={16} /><span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 relative">
          <Search size={19} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search}
            className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 outline-none focus:border-cyan-500 ${isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2"><X size={17} /></button>}
        </div>

        {loadingNotes ? (
          <div className={`mb-8 rounded-3xl border p-10 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
            <Cloud size={30} className="mx-auto mb-3 animate-pulse text-cyan-400" />{t.loading}
          </div>
        ) : <>
          {pinnedNotes.length > 0 && (
            <section className={`mb-8 rounded-3xl border p-4 sm:p-5 ${isDarkMode ? 'border-cyan-500/20 bg-cyan-500/[0.035]' : 'border-cyan-200 bg-cyan-50/60'}`}>
              <div className="mb-5 flex items-center gap-3"><Pin size={18} className="text-cyan-400" /><h2 className="text-sm font-black uppercase tracking-[0.18em]">{t.pinned}</h2><span>{pinnedNotes.length}</span></div>
              <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
                {pinnedNotes.map((note) => <NoteCard key={note.id} {...{note, language, isDarkMode, t}} onDelete={deleteNote} onShare={shareNote} onTogglePin={togglePin} onEdit={startEditing} />)}
              </div>
            </section>
          )}

          <div className="grid items-start gap-7 lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside>
              <div className={`rounded-3xl border p-5 lg:sticky lg:top-28 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="mb-6 flex items-center gap-3"><Plus size={20} className="text-cyan-400" /><h2 className="text-xl font-bold">{editingNoteId ? t.editNote : t.newNote}</h2></div>
                <FieldLabel text={t.title} dark={isDarkMode} />
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t.titlePlaceholder} className={inputClass(isDarkMode)} />
                <div className="mt-4"><FieldLabel text={t.text} dark={isDarkMode} />
                  <textarea rows={5} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder={t.textPlaceholder} className={`${inputClass(isDarkMode)} resize-none leading-6`} />
                </div>
                <div className="mt-4">
                  <label className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><Bell size={14} />{t.reminder}</label>
                  <input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} style={{ colorScheme: isDarkMode ? 'dark' : 'light' }} className={`${inputClass(isDarkMode)} ${isDarkMode ? 'easynote-reminder-dark' : ''}`} />
                  {notificationPermission === 'granted' ? (
                    <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-400"><Bell size={13} />{t.notificationsEnabled}</div>
                  ) : notificationPermission === 'unsupported' ? (
                    <div className="mt-2 text-xs font-semibold text-amber-400">{t.notificationsUnsupported}</div>
                  ) : (
                    <button type="button" onClick={enableNotifications} className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm font-bold ${isDarkMode ? 'border-cyan-500/30 text-cyan-300' : 'border-cyan-300 text-cyan-700'}`}>
                      {t.enableNotifications}
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <FieldLabel text={t.attachment} dark={isDarkMode} />
                  <label className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold ${isDarkMode ? 'border-slate-700 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                    <Paperclip size={17} />{attachmentFile || existingAttachment ? t.replaceAttachment : t.addAttachment}
                    <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={chooseAttachment} className="hidden" />
                  </label>
                  {attachmentPreview && <img src={attachmentPreview} alt="" className="mt-3 max-h-48 w-full rounded-xl object-cover" />}
                  {(attachmentFile || existingAttachment) && (
                    <button type="button" onClick={removeAttachment} className="mt-2 w-full rounded-xl border border-red-500/30 px-3 py-2 text-sm font-bold text-red-400">{t.removeAttachment}</button>
                  )}
                  {attachmentError && <p className="mt-2 text-sm font-semibold text-red-400">{attachmentError}</p>}
                </div>

                <div className="mt-5"><FieldLabel text={t.color} dark={isDarkMode} />
                  <div className="flex flex-wrap gap-3">{COLORS.map((color) => {
                    const active = selectedColor.name === color.name;
                    return <button key={color.name} type="button" title={t.colors[color.name]} onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex, boxShadow: active && isDarkMode ? `0 0 20px rgba(${color.rgb}, 0.6)` : undefined }}
                      className={`h-9 w-9 rounded-full border-2 transition-all hover:scale-110 ${active ? 'scale-110 border-cyan-400 ring-2 ring-cyan-400/20' : isDarkMode ? 'border-slate-600' : 'border-slate-200'}`} />;
                  })}</div>
                </div>

                <button type="button" onClick={editingNoteId ? saveEditedNote : addNote}
                  disabled={savingNote || (!newTitle.trim() && !newContent.trim())}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3.5 text-sm font-bold text-white disabled:opacity-40">
                  {savingNote ? <Cloud size={18} className="animate-pulse" /> : <Plus size={18} />}
                  {savingNote ? t.saving : editingNoteId ? t.saveChanges : t.save}
                </button>
                {editingNoteId && <button type="button" onClick={clearForm} disabled={savingNote}
                  className={`mt-3 w-full rounded-xl border px-4 py-3 text-sm font-bold ${isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'}`}>{t.cancel}</button>}
              </div>
            </aside>

            <section className="min-w-0">
              <div className="mb-4 flex items-center gap-3"><h2 className="text-sm font-black uppercase tracking-[0.18em]">{t.notes}</h2><span className="rounded-full px-2.5 py-1 text-xs font-bold">{normalNotes.length}</span></div>
              {normalNotes.length ? <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-3">
                {normalNotes.map((note) => <NoteCard key={note.id} {...{note, language, isDarkMode, t}} onDelete={deleteNote} onShare={shareNote} onTogglePin={togglePin} onEdit={startEditing} />)}
              </div> : <div className={`rounded-3xl border border-dashed px-6 py-16 text-center ${isDarkMode ? 'border-slate-700 bg-slate-900/40 text-slate-400' : 'border-slate-300 bg-white/50 text-slate-500'}`}><Search size={25} className="mx-auto mb-3" /><p className="font-semibold">{search ? t.emptySearch : t.empty}</p></div>}
            </section>
          </div>
        </>}
      </main>
    
      <style>{`
        .easynote-alarm-card {
          position: fixed !important; top: 24px !important; left: 50% !important;
          transform: translateX(-50%) !important; z-index: 2147483647 !important;
          width: calc(100% - 32px) !important; max-width: 480px !important;
          box-sizing: border-box !important;
        }
        .easynote-alarm-actions {
          display: grid !important; grid-template-columns: 1fr 1fr !important;
          gap: 12px !important; margin-top: 8px !important;
        }
        .easynote-alarm-stop, .easynote-alarm-snooze {
          width: 100% !important; border: 0 !important; border-radius: 12px !important;
          padding: 14px 16px !important; font-weight: 800 !important; cursor: pointer !important;
          transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease !important;
        }
        .easynote-alarm-stop { background: #ef4444 !important; color: white !important; }
        .easynote-alarm-stop:hover {
          background: #b91c1c !important; transform: scale(1.04) !important;
          box-shadow: 0 8px 24px rgba(239,68,68,.55) !important;
        }
        .easynote-alarm-snooze { background: #fbbf24 !important; color: #0f172a !important; }
        .easynote-alarm-snooze:hover {
          background: #fde047 !important; transform: scale(1.04) !important;
          box-shadow: 0 8px 24px rgba(251,191,36,.55) !important;
        }
        @media (max-width: 520px) {
          .easynote-alarm-card { top: 12px !important; }
          .easynote-alarm-actions { grid-template-columns: 1fr !important; }
        }
        .easynote-reminder-dark {
          color-scheme: dark !important;
          color: #e2e8f0 !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }
        .easynote-reminder-dark::-webkit-date-and-time-value,
        .easynote-reminder-dark::-webkit-datetime-edit,
        .easynote-reminder-dark::-webkit-datetime-edit-fields-wrapper,
        .easynote-reminder-dark::-webkit-datetime-edit-text,
        .easynote-reminder-dark::-webkit-datetime-edit-month-field,
        .easynote-reminder-dark::-webkit-datetime-edit-day-field,
        .easynote-reminder-dark::-webkit-datetime-edit-year-field,
        .easynote-reminder-dark::-webkit-datetime-edit-hour-field,
        .easynote-reminder-dark::-webkit-datetime-edit-minute-field,
        .easynote-reminder-dark::-webkit-datetime-edit-ampm-field {
          color: #e2e8f0 !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }
        .easynote-reminder-dark::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.8) !important;
          opacity: 1 !important;
        }
      `}</style>

      {activeAlarm && createPortal(
        <div className="easynote-alarm-card" onClick={(e) => e.stopPropagation()}>
          <div className={`w-full max-w-md max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border p-6 text-center shadow-2xl ${isDarkMode ? 'border-amber-400/40 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900'}`}>
            <Bell size={48} className="mx-auto mb-3 animate-bounce text-amber-400" />
            <div className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-400">{t.alarmTitle}</div>
            <h2 className="mb-2 break-words text-2xl font-extrabold">{activeAlarm.title || t.appName}</h2>
            {activeAlarm.content && <p className="mb-5 whitespace-pre-wrap break-words text-sm opacity-80">{activeAlarm.content}</p>}
            {snoozeUntil && (
              <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '2px', margin: '12px 0 16px' }}>
                {String(Math.floor(snoozeSecondsLeft / 60)).padStart(2, '0')}:{String(snoozeSecondsLeft % 60).padStart(2, '0')}
              </div>
            )}
            <div className="easynote-alarm-actions">
              <button type="button" onClick={stopAlarm} className="easynote-alarm-stop">{t.stopAlarm}</button>
              {!snoozeUntil && <button type="button" onClick={snoozeAlarm} className="easynote-alarm-snooze">{t.snoozeAlarm}</button>}
            </div>
          </div>
        </div>,
        document.body
      )}
      </div>
  );
}

function AuthScreen({ language, setLanguage, isDarkMode, setIsDarkMode, onLoggedIn }) {
  const t = translations[language];
  const initialRecoveryToken = getRecoveryTokenFromUrl();
  const [mode, setMode] = useState(initialRecoveryToken ? 'newPassword' : 'login');
  const [recoveryToken, setRecoveryToken] = useState(initialRecoveryToken);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  function changeMode(nextMode) { setMode(nextMode); setPassword(''); setError(''); setMessage(''); }
  async function submit(event) {
    event.preventDefault(); setError(''); setMessage('');
    if (mode === 'forgot') {
      if (!email.trim()) return; setLoading(true);
      try { await sendPasswordResetRequest(email.trim()); setMessage(t.resetSent); }
      catch (err) { setError(err?.message || t.authError); } finally { setLoading(false); } return;
    }
    if (mode === 'newPassword') {
      if (!recoveryToken || password.length < 6) return; setLoading(true);
      try {
        await updatePasswordRequest(recoveryToken, password);
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        setRecoveryToken(''); setPassword(''); setMessage(t.passwordUpdated); setMode('login');
      } catch (err) { setError(err?.message || t.authError); } finally { setLoading(false); } return;
    }
    if (!email.trim() || !password) return; setLoading(true);
    try {
      if (mode === 'login') onLoggedIn(await signInRequest(email.trim(), password));
      else {
        const data = await signUpRequest(email.trim(), password);
        if (data?.access_token && data?.user?.id) onLoggedIn(data);
        else { setMessage(t.checkEmail); setMode('login'); }
      }
    } catch (err) { setError(err?.message || t.authError); } finally { setLoading(false); }
  }
  const isForgot = mode === 'forgot', isNewPassword = mode === 'newPassword', showTabs = !isForgot && !isNewPassword;
  const title = isForgot ? t.resetTitle : isNewPassword ? t.newPasswordTitle : mode === 'login' ? t.signInTitle : t.signUpTitle;
  const description = isForgot ? t.resetDescription : isNewPassword ? t.newPasswordDescription : mode === 'login' ? t.signInDescription : t.signUpDescription;

  return <div className={`relative min-h-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
    <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
      <div className={`flex items-center rounded-xl border px-2 ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}><Globe size={16} className="text-cyan-400" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent px-2 py-2 text-sm font-bold outline-none">
          <option value="en" className="text-slate-900">EN</option><option value="ru" className="text-slate-900">RU</option><option value="es" className="text-slate-900">ES</option>
        </select>
      </div>
      <button onClick={() => setIsDarkMode((v) => !v)} className={`grid h-10 w-10 place-items-center rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-900 text-yellow-300' : 'border-slate-200 bg-white'}`}>{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
    </div>
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white"><Cloud size={30}/></div><h1 className="text-3xl font-black text-cyan-400">EasyNote</h1><p className="mt-2 text-sm text-slate-400">Color Notepad</p></div>
        <form onSubmit={submit} className={`rounded-3xl border p-6 shadow-2xl sm:p-8 ${isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
          {showTabs && <div className={`mb-7 grid grid-cols-2 rounded-xl p-1 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
            <button type="button" onClick={() => changeMode('login')} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}>{t.signIn}</button>
            <button type="button" onClick={() => changeMode('register')} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${mode === 'register' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}>{t.signUp}</button>
          </div>}
          <h2 className="text-2xl font-black">{title}</h2><p className="mb-6 mt-2 text-sm text-slate-400">{description}</p>
          {!isNewPassword && <><label className="mb-2 block text-xs font-bold uppercase">{t.email}</label><div className="relative"><Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className={`${inputClass(isDarkMode)} pl-11`}/></div></>}
          {!isForgot && <><label className="mb-2 mt-4 block text-xs font-bold uppercase">{isNewPassword ? t.newPassword : t.password}</label><div className="relative"><LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/><input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isNewPassword ? t.newPassword : t.passwordPlaceholder} className={`${inputClass(isDarkMode)} pl-11`}/></div></>}
          {mode === 'login' && <div className="mt-3 text-right"><button type="button" onClick={() => changeMode('forgot')} className="text-sm font-bold text-cyan-500">{t.forgotPassword}</button></div>}
          {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          {message && <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">{message}</div>}
          <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3.5 font-bold text-white disabled:opacity-50">
            {isForgot ? <Mail size={18}/> : isNewPassword ? <LockKeyhole size={18}/> : mode === 'login' ? <LogIn size={18}/> : <UserPlus size={18}/>}
            {loading ? (isForgot ? t.sendingReset : isNewPassword ? t.updatingPassword : mode === 'login' ? t.signingIn : t.registering) : (isForgot ? t.sendReset : isNewPassword ? t.updatePassword : mode === 'login' ? t.login : t.createAccount)}
          </button>
          {showTabs && <><div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-slate-700"/><span className="text-xs text-slate-400">{t.orContinueWith}</span><div className="h-px flex-1 bg-slate-700"/></div>
            <button type="button" onClick={startGoogleSignIn} disabled={loading} className={`flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3.5 font-bold ${isDarkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white text-slate-800'}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.86A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.62Z"/><path fill="#EA4335" d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z"/></svg>{t.continueWithGoogle}
            </button></>}
          {(isForgot || isNewPassword) ? <div className="mt-6 text-center"><button type="button" onClick={() => changeMode('login')} className="text-sm font-bold text-cyan-500">{t.backToSignIn}</button></div> :
            <div className="mt-6 text-center text-sm text-slate-400">{mode === 'login' ? t.noAccount : t.haveAccount}<button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} className="ml-2 font-bold text-cyan-500">{mode === 'login' ? t.signUp : t.signIn}</button></div>}
        </form>
      </div>
    </div>
  </div>;
}

function NoteCard({ note, language, isDarkMode, t, onDelete, onShare, onTogglePin, onEdit }) {
  const color = COLORS.find((item) => item.name === note.color_name) || COLORS[0];
  const style = isDarkMode
    ? { background: `linear-gradient(145deg, rgba(${color.rgb},0.16), rgba(15,23,42,0.94) 48%, rgba(${color.rgb},0.07))`, borderColor: `rgba(${color.rgb},0.42)` }
    : { background: `linear-gradient(145deg, ${note.color || color.hex}, rgba(255,255,255,0.96))`, borderColor: note.color || color.hex };
  return <article style={style} onClick={() => onEdit(note)} role="button" tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit(note); } }}
    className="group flex min-h-[210px] cursor-pointer flex-col rounded-3xl border p-5 transition-all hover:-translate-y-1">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div style={{ backgroundColor: note.color || color.hex }} className="h-3 w-3 shrink-0 rounded-full"/>
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); onTogglePin(note); }} title={note.pinned ? t.unpin : t.pin} className="grid h-8 w-8 place-items-center rounded-lg"><Pin size={16} fill={note.pinned ? 'currentColor' : 'none'}/></button>
        <button onClick={(e) => { e.stopPropagation(); onShare(note); }} className="grid h-8 w-8 place-items-center rounded-lg"><Share2 size={16}/></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(note); }} title={t.delete} className="grid h-8 w-8 place-items-center rounded-lg text-red-400"><Trash2 size={16}/></button>
      </div>
    </div>
    {note.title && <h3 className="mb-2 break-words text-lg font-extrabold">{note.title}</h3>}
    {note.content && <p className="mb-5 flex-1 whitespace-pre-wrap break-words text-sm leading-6">{note.content}</p>}
    {note.attachment_url && <img src={note.attachment_url} alt="" onClick={(e) => e.stopPropagation()} className="mb-4 max-h-56 w-full rounded-xl object-cover" />}
    <div className="mt-auto space-y-2">
      {note.reminder && <div className="flex items-center gap-2 text-xs font-semibold text-amber-400"><Bell size={13}/><span>{t.reminderLabel}: {formatReminder(note.reminder, language)}</span></div>}
      {note.attachment && <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400"><Paperclip size={13}/><span className="truncate">{t.attachmentLabel}: {note.attachment.split('/').pop()}</span></div>}
      <div className="border-t border-white/10 pt-3 text-[11px] text-slate-500">{t.created}: {formatDate(note.created_at, language)}</div>
    </div>
  </article>;
}

function SyncBadge({ state, isDarkMode, t }) {
  if (state === 'syncing') return <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400"><Cloud size={13} className="animate-pulse"/>{t.syncing}</span>;
  if (state === 'error') return <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400"><CloudOff size={13}/>{t.offline}</span>;
  return <span className={`flex items-center gap-1.5 text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}><Cloud size={13}/>{t.synced}</span>;
}
function FieldLabel({ text, dark }) {
  return <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</label>;
}
function inputClass(dark) {
  return `block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 ${dark ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'}`;
}
