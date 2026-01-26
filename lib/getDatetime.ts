export const getHariIni = (thisWeek: boolean = false) => {
  const tanggal_hari_ini = new Date();
  const tanggal_gt = String(tanggal_hari_ini.getDate()).padStart(2, "0");
  const bulan_gt = String(tanggal_hari_ini.getMonth() + 1).padStart(2, "0");
  const tahun_gt = tanggal_hari_ini.getFullYear();

  if (thisWeek) {
    const tanggal_tambah = new Date(tanggal_hari_ini);
    tanggal_tambah.setDate(
      tanggal_tambah.getDate() + (7 - tanggal_hari_ini.getDay()),
    );
    const tanggal_lt = String(tanggal_tambah.getDate()).padStart(2, "0");
    const bulan_lt = String(tanggal_tambah.getMonth() + 1).padStart(2, "0");
    const tahun_lt = String(tanggal_tambah.getFullYear());

    return {
      gt: new Date(`${tahun_gt}-${bulan_gt}-${tanggal_gt}T00:00:00.000Z`),
      lt: new Date(`${tahun_lt}-${bulan_lt}-${tanggal_lt}T00:00:00.000Z`),
    };
  }
  const tanggal_besok = new Date();
  const tanggal_lt = String(tanggal_besok.getDate() + 2).padStart(2, "0");
  const bulan_lt = String(tanggal_besok.getMonth() + 1).padStart(2, "0");
  const tahun_lt = tanggal_besok.getFullYear();

  return {
    gt: new Date(`${tahun_gt}-${bulan_gt}-${tanggal_gt}T00:00:00.000Z`),
    lt: new Date(`${tahun_lt}-${bulan_lt}-${tanggal_lt}T00:00:00.000Z`),
  };
};
