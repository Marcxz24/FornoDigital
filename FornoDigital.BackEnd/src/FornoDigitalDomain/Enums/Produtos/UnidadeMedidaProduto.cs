using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Enums.Produtos
{
    /// <summary>
    /// Define as unidades de medida comerciais utilizadas para o cadastro, comercialização 
    /// e controle de estoque dos produtos no sistema.
    /// </summary>
    public enum UnidadeMedidaProduto
    {
        /// <summary>
        /// Medida por item individual ou peça inteira (Ex: Pães, salgados, embalagens).
        /// </summary>
        Unidade = 1,

        /// <summary>
        /// Medida ponderal em gramas, utilizada para itens vendidos a peso em pequena escala.
        /// </summary>
        Grama = 2,

        /// <summary>
        /// Medida ponderal em quilogramas, utilizada para massas, farinhas e produtos vendidos a granel.
        /// </summary>
        Quilograma = 3,

        /// <summary>
        /// Medida volumétrica em mililitros, utilizada para líquidos em porções fracionadas.
        /// </summary>
        Mililitro = 4,

        /// <summary>
        /// Medida volumétrica em litros, utilizada para bebidas e insumos líquidos em maior escala.
        /// </summary>
        Litro = 5
    }
}
