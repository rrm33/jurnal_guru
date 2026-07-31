import Swal from 'sweetalert2';

export const swalAlert = (text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success') => {
  let finalIcon = icon;
  if (text.toLowerCase().includes('gagal') || text.toLowerCase().includes('tidak boleh') || text.toLowerCase().includes('harap') || text.toLowerCase().includes('sudah terdaftar') || text.toLowerCase().includes('error')) {
    finalIcon = 'error';
  } else if (text.toLowerCase().includes('peringatan') || text.toLowerCase().includes('warning')) {
    finalIcon = 'warning';
  }
  return Swal.fire({ 
    text, 
    icon: finalIcon,
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'Tutup'
  });
};

export const swalConfirm = async (text: string, title = 'Konfirmasi'): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal'
  });
  return result.isConfirmed;
};
