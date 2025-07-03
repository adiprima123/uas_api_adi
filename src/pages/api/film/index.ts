import type { NextApiRequest, NextApiResponse } from 'next'

type Film = {
  id: string
  judul: string
  kategori: string
  durasi: string
  jadwal: string[]
  harga: number
  img_url: string
}

const filmList: Film[] = [
  {
    id: '1',
    judul: 'Avengers: Endgame',
    kategori: 'Aksi',
    durasi: '3 jam 2 menit',
    jadwal: ['13:00', '16:00', '19:00'],
    harga: 50000,
    img_url: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg'
  },
  {
    id: '2',
    judul: 'Coco',
    kategori: 'Animasi',
    durasi: '1 jam 45 menit',
    jadwal: ['10:00', '13:00', '17:00'],
    harga: 45000,
    img_url: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg'
  },
  {
    id: '3',
    judul: 'Interstellar',
    kategori: 'Sci-Fi',
    durasi: '2 jam 49 menit',
    jadwal: ['14:30', '18:00'],
    harga: 55000,
    img_url: 'https://image.tmdb.org/t/p/w500/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg'
  }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Film[]>
) {
  if (req.method === 'GET') {
    res.status(200).json(filmList)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
