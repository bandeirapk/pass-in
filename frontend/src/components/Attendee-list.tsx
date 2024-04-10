import { ChangeEvent, useState, useEffect } from 'react';

import { setHours, setMinutes, setSeconds, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  MagnifyingGlass,
  DotsThree,
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from '@phosphor-icons/react';

import { IconButton } from './Icon-button';
import { Table } from './table/Table';
import { TableHeader } from './table/Table-header';
import { TableCell } from './table/Table-cell';

interface AttendeeProps {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? '';
    }

    return '';
  });
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page')); // Pegando o valor da query page
    }

    return 1;
  });
  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<AttendeeProps[]>([]);

  const totalPages = Math.ceil(total / 10);

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees'
    );

    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 0) {
      url.searchParams.set('query', search);
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees);
        setTotal(data.total);
      });
  }, [page, search]);

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url);
    setPage(page);
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set('search', String(search));
    window.history.pushState({}, '', url);
    setSearch(search);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
  }

  function backToPage() {
    setCurrentPage(page - 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <MagnifyingGlass className="size-4 text-emerald-300" />
          <input
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participante..."
            onChange={onSearchInputChanged}
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                value={search}
                className="size-4 bg-black/20 rounded border border-white/10"
                onChange={onSearchInputChanged}
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map(attendee => {
            return (
              <tr
                key={attendee.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistance(
                    setSeconds(
                      setMinutes(
                        setHours(
                          new Date(attendee.createdAt),
                          new Date().getHours()
                        ),
                        new Date().getMinutes()
                      ),
                      new Date().getSeconds()
                    ),
                    new Date(),
                    {
                      locale: ptBR,
                      addSuffix: true,
                    }
                  )}
                </TableCell>
                <TableCell>
                  {attendee.checkedInAt ? (
                    formatDistance(
                      setSeconds(
                        setMinutes(
                          setHours(
                            new Date(attendee.checkedInAt),
                            new Date().getHours()
                          ),
                          new Date().getMinutes()
                        ),
                        new Date().getSeconds()
                      ),
                      new Date(),
                      {
                        locale: ptBR,
                        addSuffix: true,
                      }
                    )
                  ) : (
                    <span className="text-zinc-400">Não fez check-in</span>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <DotsThree className="size-4" />
                  </IconButton>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {total} itens
            </TableCell>
            <TableCell
              className="text-right"
              colSpan={3}
            >
              <div className="inline-flex gap-8 items-center">
                Página {page} de {totalPages}
                <div className="flex gap-1.5">
                  <IconButton
                    onClick={goToFirstPage}
                    disabled={page === 1}
                  >
                    <CaretDoubleLeft className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={backToPage}
                    disabled={page === 1}
                  >
                    <CaretLeft className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <CaretRight className="size-4" />
                  </IconButton>

                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <CaretDoubleRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
