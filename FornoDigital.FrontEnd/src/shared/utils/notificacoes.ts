import Swal, { type SweetAlertIcon } from "sweetalert2";

interface CoresNotificacao {
  fundo: string;
  texto: string;
  destaque: string;
  perigo: string;
}

/**
 * Lê as cores CSS do tema aplicado ao app-shell.
 * Usa valores de reserva caso o componente ainda não esteja disponível.
 */
function obterCoresNotificacao(): CoresNotificacao {
  const appShell = document.querySelector<HTMLElement>(".app-shell");
  const estilos = getComputedStyle(appShell ?? document.documentElement);

  return {
    fundo: estilos.getPropertyValue("--surface").trim() || "#1b1b1b",
    texto: estilos.getPropertyValue("--text").trim() || "#f3f4f6",
    destaque: estilos.getPropertyValue("--accent").trim() || "#2563eb",
    perigo: estilos.getPropertyValue("--danger").trim() || "#a84d4d",
  };
}

/**
 * Exibe uma notificação temporária no canto superior direito.
 * O temporizador pausa quando o mouse passa sobre a notificação e retoma ao sair.
 */
export function notificar(icon: SweetAlertIcon, titulo: string) {
  const cores = obterCoresNotificacao();

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: cores.fundo,
    color: cores.texto,
    customClass: {
      popup: "forno-alert-toast",
      timerProgressBar: "forno-alert-progress",
    },
    didOpen: (elementoToast) => {
      elementoToast.addEventListener("mouseenter", Swal.stopTimer);
      elementoToast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  return toast.fire({
    icon,
    title: titulo,
  });
}

/**
 * Abre um diálogo de confirmação e informa se a pessoa confirmou a ação.
 * A função não executa exclusões nem chamadas HTTP; quem a chama decide o que fazer.
 */
export async function confirmarAcao(
  titulo: string,
  texto: string,
): Promise<boolean> {
  const cores = obterCoresNotificacao();

  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: cores.destaque,
    cancelButtonColor: cores.perigo,
    confirmButtonText: "Sim, confirmar",
    cancelButtonText: "Cancelar",
    background: cores.fundo,
    color: cores.texto,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "forno-alert-dialog",
      title: "forno-alert-title",
      confirmButton: "forno-alert-confirm",
      cancelButton: "forno-alert-cancel",
    },
  });

  return resultado.isConfirmed;
}