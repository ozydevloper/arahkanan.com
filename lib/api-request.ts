import prisma from "@/DB/db";
import {
  RequestAgendaById,
  RequestAgendaCreate,
  RequestAgendaDelete,
  RequestAgendaGet,
  RequestAgendaSearch,
  RequestAgendaUnPublished,
  RequestAgendaUpdate,
  RequestItemCreate,
  RequestItemDelete,
  RequestItemGet,
  RequestItemUpdate,
  RequestUserDelete,
  RequestUserGet,
  RequestUserUpdate,
} from "@/dtype/request-item";
import { getHariIni } from "./getDatetime";
import { addDays, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

//API AGENDA ITEM

export async function createItem(item: string, newItem: RequestItemCreate) {
  if (item === "kategori") {
    return await prisma.kategori.create({
      data: newItem,
    });
  } else if (item === "topik") {
    return await prisma.topik.create({
      data: newItem,
    });
  } else if (item === "kota") {
    return await prisma.kota.create({
      data: newItem,
    });
  } else if (item === "kalangan") {
    return await prisma.kalangan.create({
      data: newItem,
    });
  } else if (item === "biaya") {
    return await prisma.biaya.create({
      data: newItem,
    });
  } else {
    throw new Error();
  }
}

export async function deleteItem(
  item: string,
  deleteItemById: RequestItemDelete,
) {
  if (item === "kategori") {
    return await prisma.kategori.delete({
      where: deleteItemById,
    });
  } else if (item === "topik") {
    return await prisma.topik.delete({
      where: deleteItemById,
    });
  } else if (item === "kota") {
    return await prisma.kota.delete({
      where: deleteItemById,
    });
  } else if (item === "kalangan") {
    return await prisma.kalangan.delete({
      where: deleteItemById,
    });
  } else if (item === "biaya") {
    return await prisma.biaya.delete({
      where: deleteItemById,
    });
  } else {
    throw new Error();
  }
}

export async function updateItem(
  item: string,
  updateItemById: RequestItemUpdate,
) {
  if (item === "kategori") {
    return await prisma.kategori.update({
      where: { id: updateItemById.id },
      data: {
        name: updateItemById.name,
      },
    });
  } else if (item === "topik") {
    return await prisma.topik.update({
      where: { id: updateItemById.id },
      data: {
        name: updateItemById.name,
      },
    });
  } else if (item === "kota") {
    return await prisma.kota.update({
      where: { id: updateItemById.id },
      data: {
        name: updateItemById.name,
      },
    });
  } else if (item === "kalangan") {
    return await prisma.kalangan.update({
      where: {
        id: updateItemById.id,
      },
      data: {
        name: updateItemById.name,
      },
    });
  } else if (item === "biaya") {
    return await prisma.biaya.update({
      where: {
        id: updateItemById.id,
      },
      data: {
        name: updateItemById.name,
      },
    });
  } else {
    throw new Error();
  }
}

export async function getAllItems(item: string) {
  if (item === "kategori") {
    const items = await prisma.kategori.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalItems = await prisma.kategori.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "topik") {
    const items = await prisma.topik.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalItems = await prisma.topik.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "kota") {
    const items = await prisma.kota.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.kota.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "kalangan") {
    const items = await prisma.kalangan.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.kalangan.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "biaya") {
    const items = await prisma.biaya.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.biaya.count();
    return {
      data: items,
      total: totalItems,
    };
  } else {
    throw new Error();
  }
}

export async function getSomeItems(
  item: string,
  optionGetItems: RequestItemGet,
) {
  const batch = optionGetItems.batch;
  const page = (optionGetItems.page - 1) * batch;
  if (item === "kategori") {
    const items = await prisma.kategori.findMany({
      take: batch,
      skip: page,
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.kategori.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "topik") {
    const items = await prisma.topik.findMany({
      take: batch,
      skip: page,
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.topik.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "kota") {
    const items = await prisma.kota.findMany({
      take: batch,
      skip: page,
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.kota.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "kalangan") {
    const items = await prisma.kalangan.findMany({
      take: batch,
      skip: page,
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.kalangan.count();
    return {
      data: items,
      total: totalItems,
    };
  } else if (item === "biaya") {
    const items = await prisma.biaya.findMany({
      take: batch,
      skip: page,
      orderBy: {
        createdAt: "asc",
      },
    });
    const totalItems = await prisma.biaya.count();
    return {
      data: items,
      total: totalItems,
    };
  } else {
    throw new Error();
  }
}

//API REQUEST AGENDA

export async function deletedAgendaById(agendaId: RequestAgendaDelete) {
  return await prisma.agenda.delete({
    where: agendaId,
  });
}

export async function getSomeAgendas(optionGetAgendas: RequestAgendaGet) {
  const batch = optionGetAgendas.batch;
  const page = (optionGetAgendas.page - 1) * batch;
  const hariIni = getHariIni();
  const agendas = await prisma.agenda.findMany({
    skip: page,
    take: batch,
    orderBy: {
      createdAt: "desc",
    },
    ...(!!!optionGetAgendas.all && {
      where: {
        date: {
          gte: hariIni.gt,
        },
        published: true,
      },
    }),
    include: {
      user_relation: true,
    },
  });
  const totalAgendas = await prisma.agenda.count({
    orderBy: {
      createdAt: "desc",
    },
    ...(!!!optionGetAgendas.all && {
      where: {
        date: {
          gte: hariIni.gt,
        },
        published: true,
      },
    }),
  });
  return {
    data: agendas,
    total: totalAgendas,
  };
}

export async function getAgendaSearch(optionGetAgendas: RequestAgendaSearch) {
  const batch = optionGetAgendas.batch;
  const page = (optionGetAgendas.page - 1) * batch;
  const hariIni = getHariIni();

  let start = null;
  let end = null;

  if (optionGetAgendas.date) {
    const [ty, tm, td] = optionGetAgendas.date?.split("-").map(Number);
    const date = new Date(ty, tm - 1, td);

    start = fromZonedTime(startOfDay(date), "Asia/Jakarta");
    end = fromZonedTime(addDays(startOfDay(date), 1), "Asia/Jakarta");
  }

  const agendas = await prisma.agenda.findMany({
    skip: page,
    take: batch,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
      },
      published: true,
      AND: {
        ...(optionGetAgendas.title && {
          title: {
            contains: optionGetAgendas.title,
            mode: "insensitive",
          },
        }),
        ...(optionGetAgendas.biaya_name && {
          biaya_name: optionGetAgendas.biaya_name,
        }),
        ...(optionGetAgendas.kalangan_name && {
          kalangan_name: optionGetAgendas.kalangan_name,
        }),
        ...(optionGetAgendas.kategori_name && {
          kategori_name: optionGetAgendas.kategori_name,
        }),
        ...(optionGetAgendas.kota_name && {
          kota_name: optionGetAgendas.kota_name,
        }),
        ...(optionGetAgendas.topik_name && {
          topik_name: optionGetAgendas.topik_name,
        }),
        ...(optionGetAgendas.on && {
          on: String(optionGetAgendas.on),
        }),
        ...(optionGetAgendas.date &&
          start &&
          end && {
            date: {
              gte: start,
              lt: end,
            },
          }),
      },
    },
    include: {
      user_relation: true,
    },
  });
  const totalAgendas = await prisma.agenda.count({
    skip: page,
    take: batch,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
      },
      published: true,
      AND: {
        ...(optionGetAgendas.title && {
          title: {
            contains: optionGetAgendas.title.toLowerCase(),
            mode: "insensitive",
          },
        }),
        ...(optionGetAgendas.biaya_name && {
          biaya_name: optionGetAgendas.biaya_name,
        }),
        ...(optionGetAgendas.kalangan_name && {
          kalangan_name: optionGetAgendas.kalangan_name,
        }),
        ...(optionGetAgendas.kategori_name && {
          kategori_name: optionGetAgendas.kategori_name,
        }),
        ...(optionGetAgendas.kota_name && {
          kota_name: optionGetAgendas.kota_name,
        }),
        ...(optionGetAgendas.topik_name && {
          topik_name: optionGetAgendas.topik_name,
        }),
        ...(optionGetAgendas.on && {
          on: String(optionGetAgendas.on),
        }),
        ...(optionGetAgendas.date &&
          start &&
          end && {
            date: {
              gte: start,
              lt: end,
            },
          }),
      },
    },
  });
  return {
    data: agendas,
    total: totalAgendas,
  };
}

export async function getAgendaUnpublished(
  optionGetAgendas: RequestAgendaUnPublished,
) {
  const batch = optionGetAgendas.batch;
  const page = (optionGetAgendas.page - 1) * batch;
  const hariIni = getHariIni();

  const agendas = await prisma.agenda.findMany({
    skip: page,
    take: batch,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
      },
      published: false,
      ...(optionGetAgendas.role !== "SUDO" && {
        user_id: optionGetAgendas.id,
      }),
    },

    include: {
      user_relation: true,
    },
  });
  const total = await prisma.agenda.count({
    skip: page,
    take: batch,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
      },
      published: false,
      ...(optionGetAgendas.role !== "SUDO" && {
        user_id: optionGetAgendas.id,
      }),
    },
  });
  return {
    data: agendas,
    total: total,
  };
}

export async function createAgenda(
  newAgenda: Omit<RequestAgendaCreate, "image">,
) {
  return await prisma.agenda.create({
    data: {
      activity_time: newAgenda.activity_time,
      date: new Date(newAgenda.date),
      description: newAgenda.description,
      image_public_id: newAgenda.image_public_id,
      image_url: newAgenda.image_url,
      on: newAgenda.on,
      time: newAgenda.time,
      title: newAgenda.title,
      biaya_name: newAgenda.biaya_name,
      kalangan_name: newAgenda.kalangan_name,
      kategori_name: newAgenda.kategori_name,
      topik_name: newAgenda.topik_name,
      kota_name: newAgenda.kota_name,
      location_detail: newAgenda.location_detail,
      location_url: newAgenda.location_url,
      pembicara: newAgenda.pembicara,
      penyelenggara: newAgenda.penyelenggara,
      via_link: newAgenda.via_link,
      via_name: newAgenda.via_name,
      published: newAgenda.published,
      user_id: newAgenda.user_id,
    },
  });
}

export async function updateAgenda(
  agenda: Omit<RequestAgendaUpdate, "image" | "user_id">,
) {
  return await prisma.agenda.update({
    where: {
      id: agenda.id,
    },
    data: {
      ...(agenda.activity_time && { activity_time: agenda.activity_time }),
      ...(agenda.biaya_name && { biaya_name: agenda.biaya_name }),
      ...(agenda.date && { date: new Date(agenda.date) }),
      ...(agenda.description && { description: agenda.description }),
      ...(agenda.kalangan_name && {
        kalangan_name: agenda.kalangan_name,
      }),
      ...(agenda.kategori_name && { kategori_name: agenda.kategori_name }),
      ...(agenda.kota_name && {
        kota_name: agenda.kota_name,
      }),
      ...(agenda.location_url && {
        location_url: agenda.location_url,
      }),
      ...(agenda.location_detail && {
        location_detail: agenda.location_detail,
      }),
      ...(agenda.on && {
        on: agenda.on,
      }),
      ...(agenda.pembicara && {
        pembicara: agenda.pembicara,
      }),
      ...(agenda.penyelenggara && {
        penyelenggara: agenda.penyelenggara,
      }),
      ...(agenda.time && {
        time: agenda.time,
      }),
      ...(agenda.title && {
        title: agenda.title,
      }),
      ...(agenda.topik_name && {
        topik_name: agenda.topik_name,
      }),
      ...(agenda.via_link && {
        via_link: agenda.via_link,
      }),
      ...(agenda.via_name && {
        via_name: agenda.via_name,
      }),
      ...(agenda.image_url &&
        agenda.image_public_id && {
          image_public_id: agenda.image_public_id,
          image_url: agenda.image_url,
        }),

      ...(agenda.published && {
        published:
          agenda.published === "1" ? true : agenda.published === "0" && false,
      }),
    },
  });
}

export async function getAgendaById(body: RequestAgendaById) {
  const agenda = await prisma.agenda.findUnique({
    where: {
      id: body.id,
    },
    include: {
      user_relation: true,
    },
  });

  return {
    data: agenda,
  };
}

export async function getAgendaHariIni(optionGetAgendas: RequestAgendaGet) {
  const batch = optionGetAgendas.batch;
  const page = (optionGetAgendas.page - 1) * batch;
  const hariIni = getHariIni();

  const agendaHariIni = await prisma.agenda.findMany({
    take: batch,
    skip: page,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
        lt: hariIni.lt,
      },
      published: true,
    },
    include: {
      user_relation: true,
    },
  });
  const totalAgenda = await prisma.agenda.count({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
        lt: hariIni.lt,
      },
      published: true,
    },
  });
  return {
    data: agendaHariIni,
    total: totalAgenda,
  };
}

export async function getAgendaMingguIni(optionGetAgendas: RequestAgendaGet) {
  const batch = optionGetAgendas.batch;
  const page = (optionGetAgendas.page - 1) * batch;
  const hariIni = getHariIni(true);

  const agendaMingguIni = await prisma.agenda.findMany({
    take: batch,
    skip: page,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
        lt: hariIni.lt,
      },
      published: true,
    },
    include: {
      user_relation: true,
    },
  });
  const totalAgenda = await prisma.agenda.count({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      date: {
        gte: hariIni.gt,
        lt: hariIni.lt,
      },
      published: true,
    },
  });
  return {
    data: agendaMingguIni,
    total: totalAgenda,
  };
}

export async function getAllUser(body: RequestUserGet) {
  const batch = body.batch;
  const page = (body.page - 1) * batch;
  const users = await prisma.user.findMany({
    take: batch,
    skip: page,
  });
  const total = await prisma.user.count({
    take: batch,
    skip: page,
  });
  return {
    data: users,
    total: total,
  };
}

export async function updateUser(body: RequestUserUpdate) {
  return await prisma.user.update({
    where: {
      id: body.id,
    },
    data: {
      role: body.role,
    },
  });
}

export async function deleteUser(body: RequestUserDelete) {
  return await prisma.user.delete({
    where: { id: body.id },
  });
}
