'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Input, List, Spinner, HStack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

type ResultadoBusqueda = {
  id: number;
  nombre: string;
  tipo: 'perfil' | 'mascota';
  telefonoPrincipal?: string;
  especie?: string;
  fechaNacimiento?: string;
  raza?: string;
};

const iconoEspecie: Record<string, string> = {
  CANINO: '🐶',
  FELINO: '🐱',
  AVE_PSITACIDA: '🦜',
  AVE_OTRA: '🐦',
  OFIDIO: '🐍',
  QUELONIO: '🐢',
  LAGARTIJA: '🦎',
  ROEDOR: '🐹',
  LAGOMORFO: '🐰',
  HURON: '🦡',
  PORCINO: '🐷',
  OTRO: '❓',
};

const calcularEdad = (fecha: string) => {
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  const años = hoy.getFullYear() - nacimiento.getFullYear();
  const meses =
    hoy.getMonth() -
    nacimiento.getMonth() +
    (hoy.getDate() < nacimiento.getDate() ? -1 : 0);

  return `${años}A ${meses >= 0 ? meses : meses + 12}M`;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [usandoTeclado, setUsandoTeclado] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const router = useRouter();

  const { data = [], isFetching } = useQuery<ResultadoBusqueda[]>({
    queryKey: ['buscar', query],
    queryFn: async () => {
      const res = await fetch(`/api/perfiles/buscar?q=${query}`);
      return res.json();
    },
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (data.length > 0) {
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setIsOpen(false);
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const formatearTelefono = (telefono?: string) =>
    telefono
      ? telefono.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
      : '—';

  const manejarSeleccion = (item: ResultadoBusqueda) => {
    setIsOpen(false);
    setQuery('');
    const ruta =
      item.tipo === 'mascota'
        ? `/dashboard/mascotas/${item.id}`
        : `/dashboard/perfiles/${item.id}`;
    router.push(ruta);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'Escape') {
      setQuery('');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setUsandoTeclado(true);
      setSelectedIndex((prev) => Math.min(prev + 1, data.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setUsandoTeclado(true);
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const item = data[selectedIndex];
      if (item) manejarSeleccion(item);
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <Box ref={containerRef} position="relative" maxW="md" w="full">
      <Input
        placeholder="buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        bg="gray.200"
        color="tema.suave"
        border="none"
        borderRadius="3xl"
        _focus={{ boxShadow: 'none', border: 'none' }}
        _hover={{ boxShadow: 'none', border: 'none' }}
      />

      {isFetching && (
        <Spinner size="lg" position="absolute" top="2" right="2" />
      )}

      {isOpen && (
        <Box
          mt="1"
          bg="white"
          border="none"
          borderRadius="lg"
          zIndex="10"
          position="absolute"
          width="full"
          maxHeight="250px"
          overflowY="auto"
          onMouseMove={() => setUsandoTeclado(false)}
        >
          <List.Root>
            {data.map((item, index) => {
              const esSeleccionado = index === selectedIndex;
              const icono =
                item.tipo === 'perfil'
                  ? '👤'
                  : iconoEspecie[item.especie ?? ''] ?? '❓';

              return (
                <List.Item
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  key={`${item.tipo}-${item.id}`}
                  bg={esSeleccionado ? 'tema.llamativo' : 'tema.intenso'}
                  color="tema.claro"
                  px="4"
                  py="1"
                  _hover={
                    usandoTeclado
                      ? {}
                      : {
                          bg: esSeleccionado ? 'tema.llamativo' : 'tema.suave',
                          cursor: 'pointer',
                        }
                  }
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => manejarSeleccion(item)}
                >
                  <HStack align="flex-start" flexDirection="column">
                    <HStack>
                      <Text fontSize="lg">{icono}</Text>
                      <Text fontWeight="bold"
                        fontSize="md"
                        color="tema.claro"
                        pl="6">{item.nombre}</Text>
                    </HStack>

                    {item.tipo === 'perfil' && item.telefonoPrincipal && (
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="tema.claro"
                        pl="6"
                      >
                        📞 {formatearTelefono(item.telefonoPrincipal)}
                      </Text>
                    )}

                    {item.tipo === 'mascota' && (item.fechaNacimiento || item.raza) && (
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="tema.claro"
                        pl="6"
                      >
                        {item.fechaNacimiento && `📆 ${calcularEdad(item.fechaNacimiento)} `}
                        {item.raza && `🐾 ${item.raza}`}
                      </Text>
                    )}
                  </HStack>
                </List.Item>
              );
            })}
          </List.Root>
        </Box>
      )}
    </Box>
  );
}