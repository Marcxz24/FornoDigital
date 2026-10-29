using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Common
{
    /// <summary>
    /// Classe base abstrata para todas as entidades do domínio, 
    /// fornecendo identificadores exclusivos e campos de auditoria comuns.
    /// </summary>
    public abstract class EntityBase
    {
        /// <summary>
        /// Obtém ou define o identificador único (ID) da entidade.
        /// É inicializado automaticamente com um novo GUID e possui proteção de escrita externa.
        /// </summary>
        public Guid Id { get; protected set; } = Guid.NewGuid();

        /// <summary>
        /// Obtém ou define a data e hora em que a entidade foi criada, expressa em Tempo Universal Coordenado (UTC).
        /// </summary>
        public DateTime DataCriacao { get; protected set; } = DateTime.UtcNow;

        /// <summary>
        /// Obtém ou define a data e hora da última atualização realizada na entidade, expressa em UTC.
        /// Permanece nula até que o método <see cref="RegistrarAtualizacao"/> seja invocado.
        /// </summary>
        public DateTime? DataAtualizacao { get; protected set; }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="EntityBase"/>.
        /// Construtor protegido para garantir que a classe base só possa ser instanciada por classes derivadas (entidades filhas).
        /// </summary>
        protected EntityBase()
        {
        }

        /// <summary>
        /// Atualiza o carimbo de data/hora da entidade, atribuindo o horário atual em UTC 
        /// à propriedade <see cref="DataAtualizacao"/>. Deve ser chamado sempre que houver modificações na entidade.
        /// </summary>
        public void RegistrarAtualizacao()
        {
            DataAtualizacao = DateTime.UtcNow;
        }
    }
}
