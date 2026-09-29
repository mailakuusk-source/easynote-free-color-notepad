import { useEffect, useMemo, useState } from 'react';

import {
  Bell,
  Cloud,
  CloudOff,
  Globe,
  LogOut,
  Mail,
  Moon,
  Paperclip,
  Pin,
  Plus,
  Search,
  Share2,
  Sun,
  Trash2,
  UserPlus,
  LockKeyhole,
  LogIn,
  X,
} from 'lucide-react';

/* =========================================================

   SUPABASE

   Вставьте сюда Project URL и ANON / PUBLISHABLE KEY.



   ВАЖНО:

   Никогда не вставляйте сюда service_role или secret key.

   ========================================================= */

const SUPABASE_URL = 'https://xoajnfnihfyxxvftfuhe.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_-muQvM27vP9JkeAPmhn8ag_I_0oMhD3';

/* =========================================================

   LOCAL STORAGE

   ========================================================= */

const TOKEN_KEY = 'easynote_access_token';

const REFRESH_TOKEN_KEY = 'easynote_refresh_token';

const USER_ID_KEY = 'easynote_user_id';

const USER_EMAIL_KEY = 'easynote_user_email';

const LANG_KEY = 'easynote_lang';

const THEME_KEY = 'easynote_darkmode';

/* =========================================================

   ЦВЕТА

   ========================================================= */

const COLORS = [
  {
    name: 'yellow',

    hex: '#FFF9C4',

    rgb: '250, 204, 21',
  },

  {
    name: 'red',

    hex: '#FFCDD2',

    rgb: '251, 113, 133',
  },

  {
    name: 'blue',

    hex: '#BBDEFB',

    rgb: '56, 189, 248',
  },

  {
    name: 'green',

    hex: '#C8E6C9',

    rgb: '52, 211, 153',
  },

  {
    name: 'purple',

    hex: '#E1BEE7',

    rgb: '192, 132, 252',
  },

  {
    name: 'orange',

    hex: '#FFE0B2',

    rgb: '251, 146, 60',
  },
];

/* =========================================================

   ПЕРЕВОДЫ

   ========================================================= */

const translations = {
  en: {
    appName: 'EasyNote Free: Color Notepad',

    subtitle: 'Simple notes. Bright ideas. Synced to the cloud.',

    signIn: 'Sign In',

    signUp: 'Create Account',

    signInTitle: 'Welcome back',

    signUpTitle: 'Create your account',

    signInDescription: 'Sign in to access your notes from the cloud.',

    signUpDescription:
      'Create a free account and keep your notes synchronized.',

    email: 'Email',

    emailPlaceholder: 'you@example.com',

    password: 'Password',

    passwordPlaceholder: 'Your password',

    noAccount: 'No account yet?',

    haveAccount: 'Already have an account?',

    createAccount: 'Register',

    login: 'Sign In',

    logout: 'Log Out',

    signingIn: 'Signing in...',

    registering: 'Creating account...',

    checkEmail:
      'Account created. Check your email to confirm your account, then sign in.',

    authError: 'Authentication error.',

    networkError: 'Network error. Please try again.',
    forgotPassword: 'Forgot password?',
    resetTitle: 'Reset your password',
    resetDescription: 'Enter your email and we will send you a recovery link.',
    sendReset: 'Send recovery link',
    sendingReset: 'Sending...',
    resetSent:
      'Recovery email sent. Open the link in the email to choose a new password.',
    newPasswordTitle: 'Choose a new password',
    newPasswordDescription: 'Enter a new password for your EasyNote account.',
    newPassword: 'New password',
    updatePassword: 'Save new password',
    updatingPassword: 'Saving...',
    passwordUpdated: 'Password updated. You can now sign in.',
    backToSignIn: 'Back to Sign In',

    search: 'Search notes...',

    newNote: 'New Note',

    title: 'Title',

    titlePlaceholder: 'Note title',

    text: 'Note',

    textPlaceholder: 'Write something...',

    reminder: 'Reminder',

    attachment: 'Attachment',

    addAttachment: 'Attach image',

    attached: 'image_1.png',

    color: 'Color',

    save: 'Save Note',

    saving: 'Saving...',

    pinned: 'Pinned',

    notes: 'Notes',

    empty: 'No notes yet',

    emptySearch: 'Nothing found',

    delete: 'Delete',

    pin: 'Pin',

    unpin: 'Unpin',

    created: 'Created',

    reminderLabel: 'Reminder',

    attachmentLabel: 'Attachment',

    language: 'Language',

    lightMode: 'Light mode',

    darkMode: 'Dark mode',

    syncing: 'Syncing...',

    synced: 'Cloud synced',

    offline: 'Sync error',

    loading: 'Loading notes...',

    colors: {
      yellow: 'Yellow',

      red: 'Red',

      blue: 'Blue',

      green: 'Green',

      purple: 'Purple',

      orange: 'Orange',
    },
  },

  ru: {
    appName: 'EasyNote Free: Color Notepad',

    subtitle: 'Простые заметки. Яркие идеи. Синхронизация в облаке.',

    signIn: 'Вход',

    signUp: 'Регистрация',

    signInTitle: 'С возвращением',

    signUpTitle: 'Создайте аккаунт',

    signInDescription: 'Войдите, чтобы получить доступ к заметкам из облака.',

    signUpDescription:
      'Создайте бесплатный аккаунт и синхронизируйте свои заметки.',

    email: 'Email',

    emailPlaceholder: 'you@example.com',

    password: 'Пароль',

    passwordPlaceholder: 'Ваш пароль',

    noAccount: 'Ещё нет аккаунта?',

    haveAccount: 'Уже есть аккаунт?',

    createAccount: 'Зарегистрироваться',

    login: 'Войти',

    logout: 'Выйти',

    signingIn: 'Входим...',

    registering: 'Создаём аккаунт...',

    checkEmail:
      'Аккаунт создан. Проверьте почту, подтвердите email, затем войдите.',

    authError: 'Ошибка авторизации.',

    networkError: 'Ошибка сети. Попробуйте ещё раз.',
    forgotPassword: 'Забыли пароль?',
    resetTitle: 'Восстановление пароля',
    resetDescription:
      'Введите email, и мы отправим ссылку для восстановления пароля.',
    sendReset: 'Отправить ссылку',
    sendingReset: 'Отправляем...',
    resetSent:
      'Письмо отправлено. Откройте ссылку в письме и задайте новый пароль.',
    newPasswordTitle: 'Новый пароль',
    newPasswordDescription:
      'Введите новый пароль для вашего аккаунта EasyNote.',
    newPassword: 'Новый пароль',
    updatePassword: 'Сохранить новый пароль',
    updatingPassword: 'Сохраняем...',
    passwordUpdated: 'Пароль изменён. Теперь можно войти.',
    backToSignIn: 'Вернуться ко входу',

    search: 'Поиск заметок...',

    newNote: 'Новая заметка',

    title: 'Заголовок',

    titlePlaceholder: 'Название заметки',

    text: 'Текст заметки',

    textPlaceholder: 'Напишите что-нибудь...',

    reminder: 'Напоминание',

    attachment: 'Вложение',

    addAttachment: 'Прикрепить изображение',

    attached: 'image_1.png',

    color: 'Цвет',

    save: 'Сохранить заметку',

    saving: 'Сохраняем...',

    pinned: 'Закреплённые',

    notes: 'Заметки',

    empty: 'Заметок пока нет',

    emptySearch: 'Ничего не найдено',

    delete: 'Удалить',

    pin: 'Закрепить',

    unpin: 'Открепить',

    created: 'Создано',

    reminderLabel: 'Напоминание',

    attachmentLabel: 'Вложение',

    language: 'Язык',

    lightMode: 'Светлая тема',

    darkMode: 'Тёмная тема',

    syncing: 'Синхронизация...',

    synced: 'Синхронизировано',

    offline: 'Ошибка синхронизации',

    loading: 'Загружаем заметки...',

    colors: {
      yellow: 'Жёлтый',

      red: 'Красный',

      blue: 'Синий',

      green: 'Зелёный',

      purple: 'Фиолетовый',

      orange: 'Оранжевый',
    },
  },

  es: {
    appName: 'EasyNote Free: Color Notepad',

    subtitle: 'Notas simples. Ideas brillantes. Sincronizadas en la nube.',

    signIn: 'Entrar',

    signUp: 'Registro',

    signInTitle: 'Bienvenido de nuevo',

    signUpTitle: 'Crea tu cuenta',

    signInDescription: 'Inicia sesión para acceder a tus notas desde la nube.',

    signUpDescription: 'Crea una cuenta gratuita y sincroniza tus notas.',

    email: 'Email',

    emailPlaceholder: 'you@example.com',

    password: 'Contraseña',

    passwordPlaceholder: 'Tu contraseña',

    noAccount: '¿No tienes cuenta?',

    haveAccount: '¿Ya tienes una cuenta?',

    createAccount: 'Registrarse',

    login: 'Entrar',

    logout: 'Salir',

    signingIn: 'Entrando...',

    registering: 'Creando cuenta...',

    checkEmail:
      'Cuenta creada. Revisa tu correo, confirma tu email y después inicia sesión.',

    authError: 'Error de autenticación.',

    networkError: 'Error de red. Inténtalo de nuevo.',
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetTitle: 'Restablecer contraseña',
    resetDescription:
      'Introduce tu email y te enviaremos un enlace de recuperación.',
    sendReset: 'Enviar enlace',
    sendingReset: 'Enviando...',
    resetSent:
      'Correo enviado. Abre el enlace del email para elegir una nueva contraseña.',
    newPasswordTitle: 'Nueva contraseña',
    newPasswordDescription:
      'Introduce una nueva contraseña para tu cuenta de EasyNote.',
    newPassword: 'Nueva contraseña',
    updatePassword: 'Guardar nueva contraseña',
    updatingPassword: 'Guardando...',
    passwordUpdated: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    backToSignIn: 'Volver a iniciar sesión',

    search: 'Buscar notas...',

    newNote: 'Nueva nota',

    title: 'Título',

    titlePlaceholder: 'Título de la nota',

    text: 'Nota',

    textPlaceholder: 'Escribe algo...',

    reminder: 'Recordatorio',

    attachment: 'Archivo adjunto',

    addAttachment: 'Adjuntar imagen',

    attached: 'image_1.png',

    color: 'Color',

    save: 'Guardar nota',

    saving: 'Guardando...',

    pinned: 'Fijadas',

    notes: 'Notas',

    empty: 'Todavía no hay notas',

    emptySearch: 'No se encontró nada',

    delete: 'Eliminar',

    pin: 'Fijar',

    unpin: 'Desfijar',

    created: 'Creado',

    reminderLabel: 'Recordatorio',

    attachmentLabel: 'Archivo',

    language: 'Idioma',

    lightMode: 'Tema claro',

    darkMode: 'Tema oscuro',

    syncing: 'Sincronizando...',

    synced: 'Sincronizado',

    offline: 'Error de sincronización',

    loading: 'Cargando notas...',

    colors: {
      yellow: 'Amarillo',

      red: 'Rojo',

      blue: 'Azul',

      green: 'Verde',

      purple: 'Morado',

      orange: 'Naranja',
    },
  },
};

/* =========================================================

   НАСТРОЙКИ

   ========================================================= */

function loadLanguage() {
  const saved = localStorage.getItem(LANG_KEY);

  if (saved === 'en' || saved === 'ru' || saved === 'es') {
    return saved;
  }

  return 'en';
}

function loadDarkMode() {
  const saved = localStorage.getItem(THEME_KEY);

  if (saved === null) {
    return true;
  }

  return saved === 'true';
}

/* =========================================================

   SESSION

   ========================================================= */

function getStoredSession() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY) || '',

    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',

    userId: localStorage.getItem(USER_ID_KEY) || '',

    email: localStorage.getItem(USER_EMAIL_KEY) || '',
  };
}

function saveSession(data) {
  if (!data?.access_token || !data?.user?.id) {
    return false;
  }

  localStorage.setItem(TOKEN_KEY, data.access_token);

  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token || '');

  localStorage.setItem(USER_ID_KEY, data.user.id);

  localStorage.setItem(USER_EMAIL_KEY, data.user.email || '');

  return true;
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem(REFRESH_TOKEN_KEY);

  localStorage.removeItem(USER_ID_KEY);

  localStorage.removeItem(USER_EMAIL_KEY);
}

/* =========================================================

   SUPABASE AUTH

   ========================================================= */

async function signInRequest(email, password) {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,

    {
      method: 'POST',

      headers: {
        apikey: SUPABASE_ANON_KEY,

        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,

        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg || data?.message || data?.error_description || 'Sign in failed'
    );
  }

  return data;
}

async function signUpRequest(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',

    headers: {
      apikey: SUPABASE_ANON_KEY,

      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email,

      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        'Registration failed'
    );
  }

  return data;
}

async function sendPasswordResetRequest(email) {
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(
      redirectTo
    )}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        'Unable to send recovery email'
    );
  return data;
}

async function updatePasswordRequest(accessToken, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data?.msg ||
        data?.message ||
        data?.error_description ||
        'Unable to update password'
    );
  return data;
}

function getRecoveryTokenFromUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return hash.get('type') === 'recovery' ? hash.get('access_token') || '' : '';
}

/* =========================================================

   REST HEADERS



   apikey = ключ проекта

   Authorization = JWT конкретного пользователя

   ========================================================= */

function getDatabaseHeaders(accessToken, extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,

    Authorization: `Bearer ${accessToken}`,

    'Content-Type': 'application/json',

    ...extra,
  };
}

/* =========================================================

   ЗАГРУЗКА ЗАМЕТОК

   ========================================================= */

async function fetchNotes(accessToken, userId) {
  const params = new URLSearchParams();

  params.set('select', '*');

  params.set('user_id', `eq.${userId}`);

  params.set('order', 'created_at.desc');

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/notes?${params.toString()}`,

    {
      method: 'GET',

      headers: getDatabaseHeaders(accessToken),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error || 'Unable to load notes');
  }

  return response.json();
}

/* =========================================================

   СОЗДАНИЕ

   ========================================================= */

async function createNoteRequest(accessToken, userId, note) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
    method: 'POST',

    headers: getDatabaseHeaders(accessToken, {
      Prefer: 'return=representation',
    }),

    body: JSON.stringify({
      user_id: userId,

      title: note.title,

      content: note.content,

      color: note.color,

      color_name: note.color_name,

      pinned: note.pinned,

      reminder: note.reminder || null,

      attachment: note.attachment || null,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.details || 'Unable to create note');
  }

  return Array.isArray(data) ? data[0] : data;
}

/* =========================================================

   PIN / UNPIN

   ========================================================= */

async function updatePinRequest(accessToken, userId, noteId, pinned) {
  const params = new URLSearchParams();

  params.set('id', `eq.${noteId}`);

  params.set('user_id', `eq.${userId}`);

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/notes?${params.toString()}`,

    {
      method: 'PATCH',

      headers: getDatabaseHeaders(accessToken, {
        Prefer: 'return=representation',
      }),

      body: JSON.stringify({
        pinned,
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.details || 'Unable to update note');
  }

  return data;
}

/* =========================================================

   УДАЛЕНИЕ

   ========================================================= */

async function deleteNoteRequest(accessToken, userId, noteId) {
  const params = new URLSearchParams();

  params.set('id', `eq.${noteId}`);

  params.set('user_id', `eq.${userId}`);

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/notes?${params.toString()}`,

    {
      method: 'DELETE',

      headers: getDatabaseHeaders(accessToken),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error || 'Unable to delete note');
  }
}

/* =========================================================

   ДАТА

   ========================================================= */

function getLocale(language) {
  if (language === 'ru') return 'ru-RU';

  if (language === 'es') return 'es-ES';

  return 'en-US';
}

function formatDate(value, language) {
  if (!value) return '';

  return new Intl.DateTimeFormat(getLocale(language), {
    day: '2-digit',

    month: 'short',

    year: 'numeric',

    hour: '2-digit',

    minute: '2-digit',
  }).format(new Date(value));
}

function formatReminder(value, language) {
  if (!value) return '';

  return new Intl.DateTimeFormat(getLocale(language), {
    day: '2-digit',

    month: 'short',

    hour: '2-digit',

    minute: '2-digit',
  }).format(new Date(value));
}

/* =========================================================

   APP

   ========================================================= */

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

  const [search, setSearch] = useState('');

  const [newTitle, setNewTitle] = useState('');

  const [newContent, setNewContent] = useState('');

  const [reminderDate, setReminderDate] = useState('');

  const [hasAttachment, setHasAttachment] = useState(false);

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const [savingNote, setSavingNote] = useState(false);

  const t = translations[language];

  const isLoggedIn = Boolean(accessToken && userId);

  /* -------------------------------------------------------

     Сохраняем настройки

     ------------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, String(isDarkMode));
  }, [isDarkMode]);

  /* -------------------------------------------------------

     После входа загружаем облачные заметки

     ------------------------------------------------------- */

  useEffect(() => {
    if (!isLoggedIn) {
      setNotes([]);

      return;
    }

    let cancelled = false;

    async function loadCloudNotes() {
      setLoadingNotes(true);

      setSyncState('syncing');

      try {
        const data = await fetchNotes(accessToken, userId);

        if (!cancelled) {
          setNotes(data || []);

          setSyncState('synced');
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setSyncState('error');
        }
      } finally {
        if (!cancelled) {
          setLoadingNotes(false);
        }
      }
    }

    loadCloudNotes();

    return () => {
      cancelled = true;
    };
  }, [accessToken, userId, isLoggedIn]);

  /* -------------------------------------------------------

     Поиск

     ------------------------------------------------------- */

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...notes]

      .filter((note) => {
        if (!query) return true;

        return (
          String(note.title || '')
            .toLowerCase()

            .includes(query) ||
          String(note.content || '')
            .toLowerCase()

            .includes(query)
        );
      })

      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [notes, search]);

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);

  const normalNotes = filteredNotes.filter((note) => !note.pinned);

  /* -------------------------------------------------------

     Создание заметки

     ------------------------------------------------------- */

  async function addNote() {
    if (!newTitle.trim() && !newContent.trim()) {
      return;
    }

    if (!isLoggedIn || savingNote) {
      return;
    }

    setSavingNote(true);

    setSyncState('syncing');

    const newNote = {
      title: newTitle.trim(),

      content: newContent.trim(),

      color: selectedColor.hex,

      color_name: selectedColor.name,

      pinned: false,

      reminder: reminderDate || null,

      attachment: hasAttachment ? 'image_1.png' : null,
    };

    try {
      const created = await createNoteRequest(accessToken, userId, newNote);

      if (created) {
        setNotes((current) => [created, ...current]);
      }

      setNewTitle('');

      setNewContent('');

      setReminderDate('');

      setHasAttachment(false);

      setSelectedColor(COLORS[0]);

      setSyncState('synced');
    } catch (error) {
      console.error(error);

      setSyncState('error');
    } finally {
      setSavingNote(false);
    }
  }

  /* -------------------------------------------------------

     PIN

     ------------------------------------------------------- */

  async function togglePin(note) {
    const nextPinned = !note.pinned;

    // Сразу обновляем интерфейс.

    setNotes((current) =>
      current.map((item) =>
        item.id === note.id
          ? {
              ...item,

              pinned: nextPinned,
            }
          : item
      )
    );

    setSyncState('syncing');

    try {
      await updatePinRequest(accessToken, userId, note.id, nextPinned);

      setSyncState('synced');
    } catch (error) {
      console.error(error);

      // Возвращаем старое состояние,

      // если сервер не принял изменение.

      setNotes((current) =>
        current.map((item) =>
          item.id === note.id
            ? {
                ...item,

                pinned: note.pinned,
              }
            : item
        )
      );

      setSyncState('error');
    }
  }

  /* -------------------------------------------------------

     DELETE

     ------------------------------------------------------- */

  async function deleteNote(note) {
    const oldNotes = notes;

    // Оптимистичное удаление.

    setNotes((current) => current.filter((item) => item.id !== note.id));

    setSyncState('syncing');

    try {
      await deleteNoteRequest(accessToken, userId, note.id);

      setSyncState('synced');
    } catch (error) {
      console.error(error);

      setNotes(oldNotes);

      setSyncState('error');
    }
  }

  async function shareNote(note) {
    const text = [note.title, note.content].filter(Boolean).join('\n\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title || 'EasyNote',
          text: text || 'EasyNote',
        });
        return;
      }

      await navigator.clipboard.writeText(text || 'EasyNote');
      alert('Note copied to clipboard!');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  }
  /* -------------------------------------------------------

     LOG OUT

     ------------------------------------------------------- */

  function logOut() {
    clearSession();

    setAccessToken('');

    setUserId('');

    setUserEmail('');

    setNotes([]);

    setSearch('');
  }

  /* -------------------------------------------------------

     Если пользователь НЕ вошёл

     ------------------------------------------------------- */

  if (!isLoggedIn) {
    return (
      <AuthScreen
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLoggedIn={(data) => {
          saveSession(data);

          setAccessToken(data.access_token);

          setUserId(data.user.id);

          setUserEmail(data.user.email || '');
        }}
      />
    );
  }

  /* =======================================================

     ОСНОВНОЕ ПРИЛОЖЕНИЕ

     ======================================================= */

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* HEADER */}

      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          isDarkMode
            ? 'border-slate-800 bg-slate-950/90'
            : 'border-slate-200 bg-white/90'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
              {t.appName}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {t.subtitle}
              </p>

              <SyncBadge state={syncState} isDarkMode={isDarkMode} t={t} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* EMAIL */}

            <div
              className={`hidden max-w-[200px] truncate rounded-xl border px-3 py-2 text-xs sm:block ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-400'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {userEmail}
            </div>

            {/* LANGUAGE */}

            <div
              className={`flex items-center rounded-xl border px-2 ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <Globe
                size={16}
                className={isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}
              />

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className={`cursor-pointer bg-transparent px-2 py-2 text-sm font-semibold outline-none ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                <option value="en" className="text-slate-900">
                  EN
                </option>

                <option value="ru" className="text-slate-900">
                  RU
                </option>

                <option value="es" className="text-slate-900">
                  ES
                </option>
              </select>
            </div>

            {/* THEME */}

            <button
              type="button"
              onClick={() => setIsDarkMode((current) => !current)}
              title={isDarkMode ? t.lightMode : t.darkMode}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-yellow-300'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={logOut}
              title={t.logout}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition-all ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-red-400 hover:text-red-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-red-400 hover:text-red-600'
              }`}
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* SEARCH */}

        <div className="mb-7">
          <div className="relative">
            <Search
              size={19}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 ${
                isDarkMode
                  ? 'border-slate-800 bg-slate-900 text-white placeholder:text-slate-500'
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
              }`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className={`absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg ${
                  isDarkMode
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* LOADING */}

        {loadingNotes ? (
          <div
            className={`mb-8 rounded-3xl border p-10 text-center ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900 text-slate-400'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
          >
            <Cloud
              size={30}
              className="mx-auto mb-3 animate-pulse text-cyan-400"
            />

            {t.loading}
          </div>
        ) : (
          <>
            {/* PINNED — САМЫЙ ВЕРХ */}

            {pinnedNotes.length > 0 && (
              <section
                className={`mb-8 rounded-3xl border p-4 sm:p-5 ${
                  isDarkMode
                    ? 'border-cyan-500/20 bg-cyan-500/[0.035]'
                    : 'border-cyan-200 bg-cyan-50/60'
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      isDarkMode
                        ? 'bg-cyan-500/15 text-cyan-300'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    <Pin size={18} fill="currentColor" />
                  </div>

                  <div>
                    <h2
                      className={`text-sm font-black uppercase tracking-[0.18em] ${
                        isDarkMode ? 'text-cyan-300' : 'text-cyan-800'
                      }`}
                    >
                      {t.pinned}
                    </h2>

                    <p className="text-xs text-slate-500">
                      {pinnedNotes.length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      language={language}
                      isDarkMode={isDarkMode}
                      t={t}
                      onDelete={deleteNote}
                      onShare={shareNote}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* NEW NOTE + NOTES */}

            <div className="grid items-start gap-7 lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
              {/* NEW NOTE */}

              <aside>
                <div
                  className={`rounded-3xl border p-5 lg:sticky lg:top-28 ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900 shadow-2xl shadow-black/20'
                      : 'border-slate-200 bg-white shadow-xl shadow-slate-200/60'
                  }`}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        isDarkMode
                          ? 'bg-cyan-500/15 text-cyan-300'
                          : 'bg-cyan-100 text-cyan-700'
                      }`}
                    >
                      <Plus size={20} />
                    </div>

                    <h2 className="text-xl font-bold">{t.newNote}</h2>
                  </div>

                  {/* TITLE */}

                  <FieldLabel text={t.title} dark={isDarkMode} />

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder={t.titlePlaceholder}
                    className={inputClass(isDarkMode)}
                  />

                  {/* CONTENT */}

                  <div className="mt-4">
                    <FieldLabel text={t.text} dark={isDarkMode} />

                    <textarea
                      rows={5}
                      value={newContent}
                      onChange={(event) => setNewContent(event.target.value)}
                      placeholder={t.textPlaceholder}
                      className={`${inputClass(
                        isDarkMode
                      )} resize-none leading-6`}
                    />
                  </div>

                  {/* REMINDER */}

                  <div className="mt-4">
                    <label
                      className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <Bell size={14} />

                      {t.reminder}
                    </label>

                    <input
                      type="datetime-local"
                      value={reminderDate}
                      onChange={(event) => setReminderDate(event.target.value)}
                      className={`${inputClass(isDarkMode)} ${
                        isDarkMode
                          ? '[color-scheme:dark]'
                          : '[color-scheme:light]'
                      }`}
                    />
                  </div>

                  {/* ATTACHMENT */}

                  <div className="mt-4">
                    <FieldLabel text={t.attachment} dark={isDarkMode} />

                    <button
                      type="button"
                      onClick={() => setHasAttachment((current) => !current)}
                      className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm font-semibold ${
                        hasAttachment
                          ? isDarkMode
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                            : 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : isDarkMode
                          ? 'border-slate-700 bg-slate-950 text-slate-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Paperclip size={17} />

                      {hasAttachment ? t.attached : t.addAttachment}
                    </button>
                  </div>

                  {/* COLORS */}

                  <div className="mt-5">
                    <FieldLabel text={t.color} dark={isDarkMode} />

                    <div className="flex flex-wrap gap-3">
                      {COLORS.map((color) => {
                        const active = selectedColor.name === color.name;

                        return (
                          <button
                            key={color.name}
                            type="button"
                            title={t.colors[color.name]}
                            onClick={() => setSelectedColor(color)}
                            style={{
                              backgroundColor: color.hex,

                              boxShadow:
                                active && isDarkMode
                                  ? `0 0 20px rgba(${color.rgb}, 0.6)`
                                  : undefined,
                            }}
                            className={`h-9 w-9 rounded-full border-2 transition-all hover:scale-110 ${
                              active
                                ? 'scale-110 border-cyan-400 ring-2 ring-cyan-400/20'
                                : isDarkMode
                                ? 'border-slate-600'
                                : 'border-slate-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={addNote}
                    disabled={
                      savingNote || (!newTitle.trim() && !newContent.trim())
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {savingNote ? (
                      <Cloud size={18} className="animate-pulse" />
                    ) : (
                      <Plus size={18} />
                    )}

                    {savingNote ? t.saving : t.save}
                  </button>
                </div>
              </aside>

              {/* NORMAL NOTES */}

              <section className="min-w-0">
                <div className="mb-4 flex items-center gap-3">
                  <h2
                    className={`text-sm font-black uppercase tracking-[0.18em] ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {t.notes}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      isDarkMode
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {normalNotes.length}
                  </span>
                </div>

                {normalNotes.length ? (
                  <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-3">
                    {normalNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        language={language}
                        isDarkMode={isDarkMode}
                        t={t}
                        onDelete={deleteNote}
                        onShare={shareNote}
                        onTogglePin={togglePin}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`rounded-3xl border border-dashed px-6 py-16 text-center ${
                      isDarkMode
                        ? 'border-slate-700 bg-slate-900/40 text-slate-400'
                        : 'border-slate-300 bg-white/50 text-slate-500'
                    }`}
                  >
                    <Search size={25} className="mx-auto mb-3" />

                    <p className="font-semibold">
                      {search ? t.emptySearch : t.empty}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* =========================================================

   AUTH SCREEN

   ========================================================= */

function AuthScreen({
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode,
  onLoggedIn,
}) {
  const t = translations[language];
  const initialRecoveryToken = getRecoveryTokenFromUrl();
  const [mode, setMode] = useState(
    initialRecoveryToken ? 'newPassword' : 'login'
  );
  const [recoveryToken, setRecoveryToken] = useState(initialRecoveryToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function changeMode(nextMode) {
    setMode(nextMode);
    setPassword('');
    setError('');
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (mode === 'forgot') {
      if (!email.trim()) return;
      setLoading(true);
      try {
        await sendPasswordResetRequest(email.trim());
        setMessage(t.resetSent);
      } catch (err) {
        console.error(err);
        setError(err?.message || t.authError);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (mode === 'newPassword') {
      if (!recoveryToken || password.length < 6) return;
      setLoading(true);
      try {
        await updatePasswordRequest(recoveryToken, password);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search
        );
        setRecoveryToken('');
        setPassword('');
        setMessage(t.passwordUpdated);
        setMode('login');
      } catch (err) {
        console.error(err);
        setError(err?.message || t.authError);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      if (mode === 'login')
        onLoggedIn(await signInRequest(email.trim(), password));
      else {
        const data = await signUpRequest(email.trim(), password);
        if (data?.access_token && data?.user?.id) onLoggedIn(data);
        else {
          setMessage(t.checkEmail);
          setMode('login');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || t.authError);
    } finally {
      setLoading(false);
    }
  }

  const isForgot = mode === 'forgot';
  const isNewPassword = mode === 'newPassword';
  const showTabs = !isForgot && !isNewPassword;
  const title = isForgot
    ? t.resetTitle
    : isNewPassword
    ? t.newPasswordTitle
    : mode === 'login'
    ? t.signInTitle
    : t.signUpTitle;
  const description = isForgot
    ? t.resetDescription
    : isNewPassword
    ? t.newPasswordDescription
    : mode === 'login'
    ? t.signInDescription
    : t.signUpDescription;

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        <div
          className={`flex items-center rounded-xl border px-2 ${
            isDarkMode
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
          }`}
        >
          <Globe size={16} className="text-cyan-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`bg-transparent px-2 py-2 text-sm font-bold outline-none ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            <option value="en" className="text-slate-900">
              EN
            </option>
            <option value="ru" className="text-slate-900">
              RU
            </option>
            <option value="es" className="text-slate-900">
              ES
            </option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => setIsDarkMode((v) => !v)}
          className={`grid h-10 w-10 place-items-center rounded-xl border ${
            isDarkMode
              ? 'border-slate-700 bg-slate-900 text-yellow-300'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-xl shadow-cyan-500/20">
              <Cloud size={30} />
            </div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-black text-transparent">
              EasyNote
            </h1>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Color Notepad
            </p>
          </div>
          <form
            onSubmit={submit}
            className={`rounded-3xl border p-6 shadow-2xl sm:p-8 ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900/90 shadow-black/30'
                : 'border-slate-200 bg-white shadow-slate-300/40'
            }`}
          >
            {showTabs && (
              <div
                className={`mb-7 grid grid-cols-2 rounded-xl p-1 ${
                  isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => changeMode('login')}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                    mode === 'login'
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {t.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => changeMode('register')}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                    mode === 'register'
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {t.signUp}
                </button>
              </div>
            )}
            <h2 className="text-2xl font-black">{title}</h2>
            <p
              className={`mb-6 mt-2 text-sm leading-6 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {description}
            </p>
            {!isNewPassword && (
              <>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t.email}
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={`${inputClass(isDarkMode)} pl-11`}
                  />
                </div>
              </>
            )}
            {!isForgot && (
              <>
                <label
                  className={`mb-2 mt-4 block text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {isNewPassword ? t.newPassword : t.password}
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isNewPassword ? t.newPassword : t.passwordPlaceholder
                    }
                    className={`${inputClass(isDarkMode)} pl-11`}
                  />
                </div>
              </>
            )}
            {mode === 'login' && (
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => changeMode('forgot')}
                  className="text-sm font-bold text-cyan-500 hover:text-cyan-400"
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {message && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3.5 font-bold text-white disabled:opacity-50"
            >
              {isForgot ? (
                <Mail size={18} />
              ) : isNewPassword ? (
                <LockKeyhole size={18} />
              ) : mode === 'login' ? (
                <LogIn size={18} />
              ) : (
                <UserPlus size={18} />
              )}{' '}
              {loading
                ? isForgot
                  ? t.sendingReset
                  : isNewPassword
                  ? t.updatingPassword
                  : mode === 'login'
                  ? t.signingIn
                  : t.registering
                : isForgot
                ? t.sendReset
                : isNewPassword
                ? t.updatePassword
                : mode === 'login'
                ? t.login
                : t.createAccount}
            </button>
            {isForgot || isNewPassword ? (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => changeMode('login')}
                  className="text-sm font-bold text-cyan-500"
                >
                  {t.backToSignIn}
                </button>
              </div>
            ) : (
              <div
                className={`mt-6 text-center text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {mode === 'login' ? t.noAccount : t.haveAccount}
                <button
                  type="button"
                  onClick={() =>
                    changeMode(mode === 'login' ? 'register' : 'login')
                  }
                  className="ml-2 font-bold text-cyan-500"
                >
                  {mode === 'login' ? t.signUp : t.signIn}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================

   NOTE CARD

   ========================================================= */

function NoteCard({
  note,
  language,
  isDarkMode,
  t,
  onDelete,
  onShare,
  onTogglePin,
}) {
  const color =
    COLORS.find((item) => item.name === note.color_name) || COLORS[0];

  const darkStyle = {
    background: `linear-gradient(

      145deg,

      rgba(${color.rgb}, 0.16),

      rgba(15, 23, 42, 0.94) 48%,

      rgba(${color.rgb}, 0.07)

    )`,

    borderColor: `rgba(${color.rgb}, 0.42)`,

    boxShadow: `

      0 14px 40px rgba(0,0,0,0.22),

      0 0 24px rgba(${color.rgb},0.10)

    `,
  };

  const lightStyle = {
    background: `linear-gradient(

      145deg,

      ${note.color || color.hex},

      rgba(255,255,255,0.96)

    )`,

    borderColor: note.color || color.hex,
  };

  return (
    <article
      style={isDarkMode ? darkStyle : lightStyle}
      className="group flex min-h-[210px] flex-col rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          style={{
            backgroundColor: note.color || color.hex,

            boxShadow: isDarkMode
              ? `0 0 14px rgba(${color.rgb},0.40)`
              : undefined,
          }}
          className="h-3 w-3 shrink-0 rounded-full"
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTogglePin(note)}
            title={note.pinned ? t.unpin : t.pin}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
              note.pinned
                ? 'bg-cyan-500/15 text-cyan-400'
                : isDarkMode
                ? 'text-slate-500 hover:bg-slate-800 hover:text-cyan-300'
                : 'text-slate-500 hover:bg-white/60 hover:text-cyan-700'
            }`}
          >
            <Pin size={16} fill={note.pinned ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => onShare(note)}
            title="Share"
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
              isDarkMode
                ? 'text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-400'
                : 'text-slate-500 hover:bg-cyan-50 hover:text-cyan-600'
            }`}
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note)}
            title={t.delete}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
              isDarkMode
                ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'
                : 'text-slate-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {note.title && (
        <h3
          className={`mb-2 break-words text-lg font-extrabold leading-snug ${
            isDarkMode ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          {note.title}
        </h3>
      )}

      {note.content && (
        <p
          className={`mb-5 flex-1 whitespace-pre-wrap break-words text-sm leading-6 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          {note.content}
        </p>
      )}

      <div className="mt-auto space-y-2">
        {note.reminder && (
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              isDarkMode ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            <Bell size={13} />

            <span>
              {t.reminderLabel}: {formatReminder(note.reminder, language)}
            </span>
          </div>
        )}

        {note.attachment && (
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            <Paperclip size={13} />

            <span className="truncate">
              {t.attachmentLabel}: {note.attachment}
            </span>
          </div>
        )}

        <div
          className={`border-t pt-3 text-[11px] ${
            isDarkMode
              ? 'border-white/10 text-slate-500'
              : 'border-slate-800/10 text-slate-500'
          }`}
        >
          {t.created}: {formatDate(note.created_at, language)}
        </div>
      </div>
    </article>
  );
}

/* =========================================================

   SMALL COMPONENTS

   ========================================================= */

function SyncBadge({ state, isDarkMode, t }) {
  if (state === 'syncing') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
        <Cloud size={13} className="animate-pulse" />

        {t.syncing}
      </span>
    );
  }

  if (state === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
        <CloudOff size={13} />

        {t.offline}
      </span>
    );
  }

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold ${
        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
      }`}
    >
      <Cloud size={13} />

      {t.synced}
    </span>
  );
}

function FieldLabel({ text, dark }) {
  return (
    <label
      className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
        dark ? 'text-slate-300' : 'text-slate-600'
      }`}
    >
      {text}
    </label>
  );
}

function inputClass(dark) {
  return `block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 ${
    dark
      ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-600'
      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
  }`;
}
