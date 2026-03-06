<?php
/*--------------------------------------------------------------
   LanguageDTOCollection.php 2021-06-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

/**
 * Class LanguageDTOCollection
 */
class LanguageDTOCollection implements IteratorAggregate, JsonSerializable
{
    /**
     * @var LanguageDTO
     */
    private $dtos;
    
    
    /**
     * LanguageDTOCollection constructor.
     *
     * @param LanguageDTO ...$dtos
     */
    public function __construct(LanguageDTO ...$dtos)
    {
        $this->dtos = $dtos;
    }
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(static function (LanguageDTO $dto): array {
            return $dto->toArray();
        },
            $this->dtos);
    }
    
    /**
     * @return Traversable|LanguageDTO[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->dtos);
    }
    
    
    /**
     * @inheritDoc
     */
    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return $this->toArray();
    }
}