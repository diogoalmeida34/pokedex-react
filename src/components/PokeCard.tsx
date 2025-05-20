import { useState, useEffect } from "react";
import "./PokeCard.css";

type PokeCardProps = {
  nome: string;
  imagem: string | null;
  altura: number;
  peso: number;
  tipos: string[];
  ehFavorito: boolean;
  aoFavoritar: (nome: string, favorito: boolean) => void;
};

export function PokeCard({
  nome,
  imagem,
  altura,
  peso,
  tipos,
  ehFavorito,
  aoFavoritar
}: PokeCardProps) {
  const [favorito, setFavorito] = useState(ehFavorito);

  useEffect(() => {
    setFavorito(ehFavorito);
  }, [ehFavorito]);

  const alternarFavorito = () => {
    const novoEstado = !favorito;
    setFavorito(novoEstado);
    aoFavoritar(nome, novoEstado);
  };

  return (
    <div className={`pokecard-container ${favorito ? "favorito" : ""}`}>
      <h3 className="pokecard-nome">
        {nome} {favorito && <span className="star">⭐</span>}
      </h3>
      {imagem && <img className="pokecard-imagem" src={imagem} alt={nome} />}
      <div className="pokecard-info">
        <p><strong>Altura:</strong> {altura * 10} cm</p>
        <p><strong>Peso:</strong> {peso / 10} kg</p>
        <p><strong>Tipos:</strong> <span className="tipo-lista">{tipos.join(" / ")}</span></p>
      </div>
      <button
        className={`pokecard-botao ${favorito ? "desfavoritar" : ""}`}
        onClick={alternarFavorito}
      >
        {favorito ? "★ Favorito" : "☆ Favoritar"}
      </button>
    </div>
  );
}
