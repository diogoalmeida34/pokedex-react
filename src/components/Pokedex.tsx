import { useState, useEffect } from "react";
import "./Pokedex.css";
import { PokeCard } from "./PokeCard";
import pokedex from '../assets/pokedex.png';
import pokebola from '../assets/pokebola.png';

type Pokemon = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
};

export default function Pokedex() {
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [erro, setErro] = useState("");

  // Carrega favoritos do localStorage na inicialização
  useEffect(() => {
    const favoritosSalvos = localStorage.getItem("favoritos");
    if (favoritosSalvos) {
      const nomes = JSON.parse(favoritosSalvos);
      setFavoritos(nomes);

      Promise.all(
        nomes.map((nome: string) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
            .then((res) => res.json())
            .catch(() => null)
        )
      ).then((dados) => {
        const validos = dados.filter((p) => p !== null);
        setPokemons(validos);
      });
    }
  }, []);

  const buscarPokemon = async () => {
    if (!nome.trim()) return;
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`
      );
      if (!resposta.ok) throw new Error("Pokémon não encontrado");

      const dados: Pokemon = await resposta.json();

      const jaExiste = pokemons.find((p) => p.name === dados.name);
      if (!jaExiste) {
        setPokemons((prev) => [...prev, dados]);
      } else {
        setErro("Este Pokémon já foi carregado.");
      }

      setNome("");
    } catch {
      setErro("Pokémon não encontrado 😢");
    } finally {
      setCarregando(false);
    }
  };

  const limparPokemons = () => {
    // Mantém apenas os Pokémon marcados como favoritos
    setPokemons((prev) => prev.filter((p) => favoritos.includes(p.name)));
    setErro("");
    setNome("");
  };

  const atualizarFavoritos = (nomePokemon: string, ehFavorito: boolean) => {
    const novaLista = ehFavorito
      ? [...favoritos, nomePokemon]
      : favoritos.filter((n) => n !== nomePokemon);

    setFavoritos(novaLista);
    localStorage.setItem("favoritos", JSON.stringify(novaLista));
  };

  return (
    <div className="pokedex-container">
      <h2 className="pokedex-title">
        <img src={pokebola} alt="Pokebola" className="pokebola-image" />
        Pokédex
        <img src={pokedex} alt="Pokedex" className="pokebola-image" />
      </h2>

      <p className="pokedex-subtitle">
        <i>Diogo Almeida - GU3059995
        <br />
        (GRUDSMV - DESENVOLVIMENTO PARA DISPOSITIVOS MÓVEIS)</i>
      </p>

      <p className="pokedex-subtitle">
        <b>Acompanhe, colecione e explore o mundo Pokémon.</b>
      </p>

      <div className="pokedex-search">
        <input
          className="pokedex-input"
          type="text"
          placeholder="Digite o nome do Pokémon"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarPokemon()}
        />
        <button className="pokedex-button" onClick={buscarPokemon}>
          Buscar
        </button>
        <button className="pokedex-button clear" onClick={limparPokemons}>
          Limpar
        </button>
      </div>

      {carregando && <p className="pokedex-loading">Carregando...</p>}
      {erro && <p className="pokedex-error">{erro}</p>}

      <div className="pokedex-cards">
        {[...pokemons]
          .sort((a, b) => {
            const aFav = favoritos.includes(a.name) ? 1 : 0;
            const bFav = favoritos.includes(b.name) ? 1 : 0;
            return bFav - aFav;
          })
          .map((pokemon) => (
            <PokeCard
              key={pokemon.name}
              nome={pokemon.name}
              imagem={pokemon.sprites.front_default}
              altura={pokemon.height}
              peso={pokemon.weight}
              tipos={pokemon.types.map((t) => t.type.name)}
              ehFavorito={favoritos.includes(pokemon.name)}
              aoFavoritar={atualizarFavoritos}
            />
          ))}
      </div>
    </div>
  );
}
